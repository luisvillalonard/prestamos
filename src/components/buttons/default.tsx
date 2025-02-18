import type { ButtonProps } from 'antd'
import { Button } from 'antd'

export const ButtonDefault = (props: ButtonProps) => {
    return (
        <Button
            {...props}
            type="default"
            shape={props.shape ?? "round"}>
        </Button>
    )
}