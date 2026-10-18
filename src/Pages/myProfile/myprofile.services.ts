import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";
import type { GetMyProfile } from "./myprofile.interface";

export async function GetMyProfile( userId :string | undefined): Promise<GetMyProfile> {
     try {
    const response = await axiosInterceptors.get<GetMyProfile>(`/users/${userId}/profile`);
    return response.data
     }catch(error:any){
    throw new Error(error.response?.data?.message || "Failed to fetch your Profile");
     }
}