import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";

export async function getSavedPosts() {
  const response = await axiosInterceptors.get(`/users/bookmarks`);
  console.log("Full API Response:", response.data); 
  return response.data?.data?.bookmarks || response.data?.bookmarks || [];
}