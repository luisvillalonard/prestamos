import type { ButtonProps } from 'antd'
import { Button } from 'antd'

export const ButtonPrimary = (props: Omit<ButtonProps, "type">) => {
    return (
        <Button
            {...props}
            type="primary"
            shape={props.shape ?? "round"}>
        </Button>
    )
}