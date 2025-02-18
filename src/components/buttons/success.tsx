import type { ButtonProps } from 'antd'
import { Button } from 'antd'

export const ButtonSuccess = (props: ButtonProps) => {
    return (
        <Button
            {...props}
            /* variant="solid"
            color="cyan" */
            style={{ backgroundColor: '#87d068' }}
            type='primary'
            shape={props.shape ?? "round"}>
        </Button>
    )
}