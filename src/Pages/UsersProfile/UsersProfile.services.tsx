import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";
import type { GetAllUserPosts } from "./UsersPosts.interface";
import type { GetUSerProfile } from "./UsersProfile.interafce";

export async function getUserProfile(userId: string) {
    const response = await axiosInterceptors.get<GetUSerProfile>(`/users/${userId}/profile`);
    return response.data;
}

export async function GetUserPosts(userID: string ) {
    const response = await axiosInterceptors.get<GetAllUserPosts>(`/users/${userID}/posts`);
    return response.data
    
}