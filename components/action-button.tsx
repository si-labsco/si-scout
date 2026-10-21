'use client'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
// Submit button for a server-action form; shows a spinner while the action runs.
export function ActionButton({ children, className = '' }: { children: React.ReactNode; className?: string }) { const { pending } = useFormStatus(); return <button disabled={pending} className={`inline-flex items-center justify-center gap-2 disabled:opacity-70 ${className}`}>{pending && <Loader2 className="size-4 animate-spin" />}{children}</button> }
