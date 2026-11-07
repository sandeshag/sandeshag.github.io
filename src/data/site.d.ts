export interface NavLink {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
}

export interface Stat {
  value: string
  label: string
}

export const site: {
  name: string
  role: string
  tagline: string
  location: string
  email: string
  phone: string
  nav: NavLink[]
  cta: NavLink
  ngo: NavLink
  socials: SocialLink[]
  stats: Stat[]
}