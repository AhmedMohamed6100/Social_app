import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";
import type { AllPostsResponseType } from "./Posts.interface";

// 1. جلب كل البوستات (باستخدام axiosInterceptors بدلاً من axios العادي)
export async function GetAllPosts() {
    const response = await axiosInterceptors.get<AllPostsResponseType>("/posts/");
    return response.data.data.posts;
}

export async function UpdatePost(postId: string, formData: FormData) {
    const response = await axiosInterceptors.put(`/posts/${postId}`, formData);
    return response.data;
}

export async function DeletePost(postId: string) {
    const response = await axiosInterceptors.delete(`/posts/${postId}`);
    return response.data;
}

export async function togglePostLike(postId: string) {
    const response = await axiosInterceptors.put(`/posts/${postId}/like`);
    return response.data;
}

export async function getPostLikes(postId: string, page = 1, limit = 10) {
    const response = await axiosInterceptors.get(`/posts/${postId}/likes?page=${page}&limit=${limit}`);
    return response.data;
}

export async function togglePostBookmark(postId: string) {
    const response = await axiosInterceptors.put(`/posts/${postId}/bookmark`);
    return response.data;
}

export async function createPostShare(postId: string, formData: FormData) {
    const response = await axiosInterceptors.post(`/posts/${postId}/share`, formData);
    return response.data;
}

