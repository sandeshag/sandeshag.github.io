import type { NavLink } from './site.js'

export interface RecognitionItem {
  year?: string
  title: string
  source: string
  note?: string
  link?: NavLink
}

export const recognition: {
  eyebrow: string
  heading: string
  items: RecognitionItem[]
}