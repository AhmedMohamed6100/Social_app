import * as zod from "zod"
import type { registerSchema } from "./register.zod"

export type UserDataType = zod.infer<typeof registerSchema>


export interface RegisterResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  token: string
  tokenType: string
  expiresIn: string
  user: User
}

export interface User {
  _id: string
  name: string
  username: string
  email: string
  photo: string
  cover: string
}
