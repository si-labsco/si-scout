'use client'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
export function CityPicker({ cities, value }: { cities: { id: string; name: string }[]; value: string }) { const router = useRouter(); return <label className="relative block"><span className="sr-only">City</span><MapPin className="pointer-events-none absolute left-3 top-3 size-4 text-subtle" /><select value={value} onChange={(e) => router.push(`/catalogue?city=${e.target.value}`)} className="h-10 min-w-48 rounded-lg border border-foreground/15 glass pl-9 pr-3 text-sm">{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></label> }
