import type { NavLink } from './site.js'

export interface ExperienceItem {
  dates: string
  current?: boolean
  role: string
  org: string
  note?: string
  link?: NavLink
}

export interface ExperienceGroup {
  title: string
  items: ExperienceItem[]
}

export const experience: {
  eyebrow: string
  heading: string
  intro: string
  groups: ExperienceGroup[]
}