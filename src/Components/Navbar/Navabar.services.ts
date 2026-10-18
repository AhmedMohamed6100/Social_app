import axios from "axios"
import type { ChangePhotoResponseType } from "./Navbar.interface"

export async function handelChangeProfilePhoto(data: FormData): Promise<String> {
    const res = await axios.put <ChangePhotoResponseType> (`${import.meta.env.VITE_BASE_URL}/users/upload-photo`, data, {
        headers:{
            token: localStorage.getItem("user_tkn"),
        }
    })
    return res.data.message
}