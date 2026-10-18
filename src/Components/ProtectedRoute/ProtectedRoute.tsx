import { useContext } from "react"
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider"
import { Navigate } from "react-router"


function ProtectedRoute({children}:{children: React.ReactNode}) {
    const {userData} = useContext(UserAuthContext)
    
    if(userData) {
       return  children
    }

    return <Navigate to={'/login'}/>
}

export default ProtectedRoute
