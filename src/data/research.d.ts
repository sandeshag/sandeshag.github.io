export interface ResearchProject {
  title: string
  description: string
  tag: string
  image?: {
    src: string
    alt: string
  }
}

export const research: {
  eyebrow: string
  heading: string
  intro: string
  projects: ResearchProject[]
}