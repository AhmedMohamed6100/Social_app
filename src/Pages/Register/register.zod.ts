import * as zod from "zod"

export const registerSchema = zod.object({
  name:zod.string().regex(/([a-zA-Z0-9_\s]+)/, "Enter Valid Name"),
  username:zod.string().regex(/([a-zA-Z0-9_\s]+)/, "Enter Valid Name"),
  email:zod.email(),
  password: zod.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Enter Valid Password"),
  rePassword:  zod.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Enter Valid Password"),
  dateOfBirth: zod.string().refine(function(value) {
    const userData = new Date(value)
              const currentYear =  new Date();
              return currentYear.getFullYear() - userData.getFullYear() > 20
              // if() {
                // return true
              // }
              // return "Your Age Must Be Above 20 Years Old"
  }, "Your Age Must Be Above 20 Years Old"),
  gender: zod.enum(["male","female"]),
}).refine(function(value) {
  return value.password === value.rePassword
}, {
  path: ['rePassword'],
  error: "Passwrod not Same Confirm Password"
})