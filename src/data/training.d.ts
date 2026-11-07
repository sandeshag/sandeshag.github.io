export interface TrainingItem {
  year: string
  tag: string
  month: string
  duration: string
  dates: string
  title: string
  organizer: string
  place?: string
  role?: string
  note?: string
  image?: string
}

export const training: {
  eyebrow: string
  heading: string
  intro: string
  items: TrainingItem[]
}