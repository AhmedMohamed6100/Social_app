import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";

export async function CreateUserComment(postId: string, formData: FormData) {
  const response = await axiosInterceptors.post(`/posts/${postId}/comments`, formData);
  return response.data;
}

// export async function getCommentReplies(postId: string, commentId: string) {
//     const response = await axiosInterceptors.get(`/posts/${postId}/comments/${commentId}/replies`);
//     return response.data?.data?.comments || response.data?.comments || response.data?.data || [];
// }

export async function createCommentReply(postId: string, commentId: string, formData: FormData) {
    const response = await axiosInterceptors.post(`/posts/${postId}/comments/${commentId}/replies`, formData);
    return response.data;
}

export async function editComment(postId: string, commentId: string, formData: FormData) {
  const response = await axiosInterceptors.put(`/posts/${postId}/comments/${commentId}`, formData);
  return response.data;
}

export async function deleteComment(postId: string, commentId: string) {
  const response = await axiosInterceptors.delete(`/posts/${postId}/comments/${commentId}`);
  return response.data;
}

export async function toggleCommentLike(postId: string, commentId: string) {
  const response = await axiosInterceptors.put(`/posts/${postId}/comments/${commentId}/like`);
  return response.data;
}