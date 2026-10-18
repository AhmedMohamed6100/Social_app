import * as zod from "zod"

export const loginSchema = zod.object({
 
  email:zod.email(),
  password: zod.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Enter Valid Password"),
  
})