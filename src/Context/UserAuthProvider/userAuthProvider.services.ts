import axios from "axios";
import type { UserData, UserDataResponseType } from "./userAuthProvider.interface";

export async function getUserData():Promise<null|UserData> {
    try {
        const res = await axios.get<UserDataResponseType>(`${import.meta.env.VITE_BASE_URL}/users/profile-data`, {
        headers: {
            token: localStorage.getItem('user_tkn')
        }
    });

    return res.data.data.user
    } catch(error) {
        return null
    }
}