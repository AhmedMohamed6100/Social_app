import { useContext } from "react"
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider"
import { Navigate } from "react-router"


function AuthProtected({children}:{children: React.ReactNode}) {
    
      const {userData} = useContext(UserAuthContext)
        
        if(userData) {
           return  <Navigate to="/"/>
        }

    return (
        children
    )
}

export default AuthProtected
