'use client'
import { Download } from 'lucide-react'
export function PrintButton() { return <button onClick={() => window.print()} className="rounded-lg border border-[#ccd2c7] px-4 py-2.5 text-sm font-medium"><Download className="mr-2 inline size-4"/>Download brief (PDF)</button> }
