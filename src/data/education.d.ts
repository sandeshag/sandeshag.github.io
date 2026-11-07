export interface EducationItem {
  dates: string
  qualification: string
  institution: string
  thesis: string
}

export const education: {
  eyebrow: string
  heading: string
  intro: string
  items: EducationItem[]
}