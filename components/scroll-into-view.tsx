'use client'
import { useEffect } from 'react'
// Scrolls the matching element sideways into view inside its scroll container (e.g. the current step of the stage stepper on a phone).
export function ScrollIntoView({ selector }: { selector: string }) { useEffect(() => { document.querySelector(selector)?.scrollIntoView({ block: 'nearest', inline: 'center' }) }, [selector]); return null }
