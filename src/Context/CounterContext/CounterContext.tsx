import { createContext, useState } from "react";

interface CounterContextType {
    count : number,
    setCount: React.Dispatch<React.SetStateAction<number>>
}

export const counterContext =  createContext<CounterContextType>({
    count: 0,
    setCount: () => {}
})

export default function CounterContextProvider({children}:{children: React.ReactNode}) {
    const [count, setCount] = useState(0)
    return <counterContext.Provider value={{count, setCount}}>

        {children}
    </counterContext.Provider>
}