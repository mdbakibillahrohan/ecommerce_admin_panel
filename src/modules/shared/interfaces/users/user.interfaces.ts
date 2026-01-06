export interface IUser {
  user_type_id: number
  gender_id: number

  first_name: string
  last_name: string
  phone_number: string

  email: string
  username: string

  date_of_birth: Date
  password: string

  is_verified: boolean
  is_store_owner: boolean

  active_store_id: number | null
}
