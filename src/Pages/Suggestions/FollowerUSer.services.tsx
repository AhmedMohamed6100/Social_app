import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";

export async function toggleFollowUser(userId: string) {
    const response = await axiosInterceptors.put(`/users/${userId}/follow`);
    return response.data;
}