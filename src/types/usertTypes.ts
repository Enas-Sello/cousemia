import type { CourseType } from './courseType'

export type UserType = {
  id: number
  fullName: string
  username: string
  email: string
  phone: string
  referral_code: string
  courses_bought: CourseType[]
  avatar: string
  role: string
  is_active: boolean
  devices: any[]
  verified: string
  country: string
  ability: Ability[]
}
export type Ability = {
  action: string
  subject: string
}

