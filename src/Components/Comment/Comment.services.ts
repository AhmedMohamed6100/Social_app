import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors"; // تأكد من مسار الـ interceptors عندك
import type { AllCommentResponseType } from "./Comment.interface";
import type { GetAllReplayComment, Reply } from "./Replay.interface";

export async function getpostComments(postId: string) {
    const response = await axiosInterceptors.get<AllCommentResponseType>(`/posts/${postId}/comments`);
    return response.data.data.comments;
}
export async function getCommentReplies(postId: string, commentId: string): Promise<Reply[]> {  
  const response = await axiosInterceptors.get<GetAllReplayComment>(`/posts/${postId}/comments/${commentId}/replies`);
  
  return response.data?.data?.replies || [];
}
