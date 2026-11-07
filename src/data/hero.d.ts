import type { NavLink } from './site.js'

export const hero: {
  eyebrow: string
  location: string
  headline: string[]
  description: string
  status: string
  primaryAction: NavLink
  secondaryAction: NavLink
  scene: {
    label: string
    note: string
    alt: string
  }
  focusTitle: string
  focus: string[]
}