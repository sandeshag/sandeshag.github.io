export interface Publication {
  year: string
  title: string
  kind: string
  authors?: string
  outlet?: string
  language?: string
  date?: string
  link?: string
}

export const publications: {
  eyebrow: string
  heading: string
  intro: string
  items: Publication[]
}