import type React from "react";

function Parent({children}:{children:React.ReactNode}) {
    
    return (
        <h1>{children}</h1>
    )
}

export default Parent
