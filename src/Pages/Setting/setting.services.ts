import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";

export interface ChangePasswordPayload {
  passwordCurrent: string;
  password: string;
  rePassword?: string;
}

export async function changeUserPassword(data: ChangePasswordPayload) {
  const response = await axiosInterceptors.patch("/users/change-password", {
    passwordCurrent: data.passwordCurrent,
    password: data.password,
    rePassword: data.rePassword,
  });

  return response.data;
}