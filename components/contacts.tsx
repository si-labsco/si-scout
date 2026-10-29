import { Plus, Star, Trash2 } from 'lucide-react'
import { ActionButton } from '@/components/action-button'
import { removeContact, saveContact } from '@/lib/actions'
import { contactRoles, type Contact, type Venture } from '@/data/ventures'

const input = 'w-full rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent'
const chip = 'inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-full border border-foreground/15 bg-glass px-3 py-1.5 text-xs font-medium [&::-webkit-details-marker]:hidden'
const popover = 'absolute left-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-glass-border bg-popover p-4 text-popover-foreground shadow-lg'

// Contact chips under the venture name (primary first). Each chip opens an inline edit form.
export function Contacts({ venture }: { venture: Venture }) {
  const sorted = [...venture.contacts].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
  return <div className="mt-4 flex flex-wrap items-start gap-2">
    {sorted.map((c) => <details key={c.id} className="relative">
      <summary className={chip} title={[c.email, c.phone].filter(Boolean).join(' · ') || undefined}>{c.isPrimary && <Star className="size-3 fill-current text-accent-foreground" aria-label="Primary contact" />}{c.name}<span className="font-normal text-muted-foreground">· {c.role}</span></summary>
      <div className={popover}>
        <ContactForm ventureId={venture.id} contact={c} />
        <form action={removeContact.bind(null, venture.id, c.id)} className="mt-2"><ActionButton className="text-xs text-destructive"><Trash2 className="size-3.5" />Remove contact</ActionButton></form>
      </div>
    </details>)}
    <details className="relative print:hidden">
      <summary className={`${chip} border-dashed text-muted-foreground`}><Plus className="size-3.5" />Add contact</summary>
      <div className={popover}><ContactForm ventureId={venture.id} /></div>
    </details>
  </div>
}

function ContactForm({ ventureId, contact }: { ventureId: string; contact?: Contact }) {
  return <form action={saveContact.bind(null, ventureId, contact?.id ?? null)} className="flex flex-col gap-2.5 text-xs">
    <input name="name" defaultValue={contact?.name} placeholder="Name" required aria-label="Name" className={input} />
    <select name="role" defaultValue={contact?.role ?? 'CEO'} aria-label="Role" className={input}>{contactRoles.map((r) => <option key={r}>{r}</option>)}</select>
    <input name="email" type="email" defaultValue={contact?.email} placeholder="Email" aria-label="Email" className={input} />
    <input name="phone" defaultValue={contact?.phone} placeholder="Phone" aria-label="Phone" className={input} />
    <input name="linkedin" type="url" defaultValue={contact?.linkedin} placeholder="LinkedIn URL" aria-label="LinkedIn URL" className={input} />
    <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" name="isPrimary" defaultChecked={contact?.isPrimary} className="size-4 accent-[var(--accent)]" />Primary contact</label>
    {contact?.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="underline decoration-accent underline-offset-4">Open LinkedIn</a>}
    <ActionButton className="min-h-9 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">{contact ? 'Save contact' : 'Add contact'}</ActionButton>
  </form>
}
