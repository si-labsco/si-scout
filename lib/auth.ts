import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Single-admin login. Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD, and the session cookie is
// signed with AUTH_SECRET. If any of them is missing, nobody can log in (fails closed).

export const SESSION_COOKIE = 'si_session'
const SESSION_DAYS = 7

const secret = () => process.env.AUTH_SECRET ?? ''
export const authConfigured = () => Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET)

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')
const sameText = (a: string, b: string) => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function checkCredentials(email: string, password: string) {
  if (!authConfigured()) return false
  const emailOk = sameText(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase())
  const passwordOk = sameText(password, process.env.ADMIN_PASSWORD!)
  return emailOk && passwordOk
}

export function createSession(email: string) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = `${Buffer.from(email).toString('base64url')}.${expires}`
  return { value: `${payload}.${sign(payload)}`, expires: new Date(expires) }
}

export function verifySession(value: string | undefined) {
  if (!value || !authConfigured()) return false
  const [email, expires, signature] = value.split('.')
  if (!email || !expires || !signature) return false
  if (!sameText(signature, sign(`${email}.${expires}`))) return false
  return Number(expires) > Date.now()
}

// For server actions: they are POSTs the proxy also sees, but checking here keeps them safe if routes move.
// Returns the signed-in email, recorded on pipeline moves.
export async function requireSession() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value
  if (!verifySession(value)) redirect('/login')
  return Buffer.from(value!.split('.')[0], 'base64url').toString()
}
