import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors"; 

export async function getMyPosts(userId: string | undefined ) {
  try {
    const res = await axiosInterceptors.get(`/users/${userId}/posts`);

    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch your posts");
  }
}