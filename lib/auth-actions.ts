'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, checkCredentials, createSession } from '@/lib/auth'

export type LoginState = { error?: string; email?: string }

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  if (!checkCredentials(email, password)) return { error: 'That email and password don’t match.', email }
  const session = createSession(email.trim().toLowerCase())
  ;(await cookies()).set(SESSION_COOKIE, session.value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires: session.expires })
  const next = String(formData.get('next') ?? '')
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/')
}

export async function logout() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/login')
}
