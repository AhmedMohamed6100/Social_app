import axios from "axios";
import type { CreatePostResponseType } from "./CreatePost.interface";

export async function createUserPost(data: FormData) {
    try {
        const res = await axios.post<CreatePostResponseType>(`${import.meta.env.VITE_BASE_URL}/posts`, data, {
            headers: {
                token: localStorage.getItem('user_tkn')
                
            }
        });
        return res.data.message
        
    }
    catch(error) {
        if(axios.isAxiosError<{message:string}>(error)) {
            throw new Error(error.response?.data.message)
        }
    }
}