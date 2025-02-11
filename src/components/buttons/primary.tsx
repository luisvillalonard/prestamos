import { Button } from 'antd'
import type { ButtonProps } from 'antd'

export const ButtonPrimary = (props: ButtonProps) => {
    
    const { shape, icon, onClick } = props

    return (
        <Button
            {...props}
            type="primary"
            shape={shape ?? "round"}
            icon={icon}
            onClick={onClick}>
        </Button>
    )
}