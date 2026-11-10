import type { NavLink } from './site.js'

export interface ViewItem {
  type: 'article' | 'podcast'
  title: string
  source: string
  date: string
  view: string
  link?: NavLink
}

export const views: {
  eyebrow: string
  heading: string
  intro: string
  items: ViewItem[]
}