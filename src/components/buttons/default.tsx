import { Button } from 'antd'
import type { ButtonProps } from 'antd'

export const ButtonDefault = (props: ButtonProps) => {
    const { shape, icon, onClick } = props

    return (
        <Button
            {...props}
            type="default"
            shape={shape ?? "round"}
            icon={icon}
            onClick={onClick}>
        </Button>
    )
}