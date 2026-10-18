import axios from "axios"
import type { PostDetailsResponseType } from "./PostCard.interface"

export async function GetPostDetails(postId: string ) {
    const response = await axios.get<PostDetailsResponseType>(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
        headers: {
            token: localStorage.getItem("user_tkn"),
        }
    })
    return response.data.data.post
}