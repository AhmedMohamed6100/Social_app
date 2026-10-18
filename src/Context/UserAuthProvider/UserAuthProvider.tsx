import { createContext, useEffect, useState } from "react";
import type { UserAuthContextType, UserData } from "./userAuthProvider.interface";
import { getUserData } from "./userAuthProvider.services";

export const UserAuthContext =  createContext<UserAuthContextType>({
    userData: null,
    setUserData: () => {}
})


export default function UserAuthProvider({children}:{children: React.ReactNode}) {

    // lazy initialization

    const [userData, setUserData] = useState<UserData|null>(null)

    useEffect(function() {
        getUserData().then(function(data){setUserData(data)})
    }, [])

    // use suspend

    return <UserAuthContext.Provider value={{userData, setUserData}}>
        {children}
    </UserAuthContext.Provider>
}