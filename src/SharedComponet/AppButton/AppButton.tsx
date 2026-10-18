import { Button } from "@heroui/react"

function AppButton({children, ...prop}:React.ComponentProps<typeof Button>) {
    
    return (
        <Button {...prop}>
            {children}
        </Button>
    )
}

export default AppButton
