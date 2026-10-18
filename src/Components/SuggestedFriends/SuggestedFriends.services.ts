import type { AllSuggestedFriends } from "./SuggestedFriends.interface"
import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";

export async function GetSuggestedFriends(data: string, search: string) {
    const response = await axiosInterceptors.get<AllSuggestedFriends>("/users/suggestions", {
        params: { data, ...(search ? { search } : {}) }
    });
    return response.data;
}