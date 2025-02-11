import { Button } from 'antd'
import type { ButtonProps } from 'antd'

export const ButtonDanger = (props: ButtonProps) => {

    const { shape, icon, onClick } = props

    return (
        <Button
            {...props}
            danger
            type="primary"
            shape={shape ?? "round"}
            icon={icon}
            onClick={onClick}>
        </Button>
    )
}
