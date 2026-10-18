import axios from "axios";
import type { RegisterResponseType, UserDataType } from "./register.interface";

export async function userRegister(userData: UserDataType): Promise<string> {
  try {
    const response = await axios.post<RegisterResponseType>(
      `${import.meta.env.VITE_BASE_URL}/users/signup`,
      userData,
    );
    
    return response.data.message;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message);
    }

    throw new Error("NetWork Error");
  }
}
