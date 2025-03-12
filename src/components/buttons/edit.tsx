import { Button } from 'antd'
import type { ButtonProps } from 'antd'
import { useIconos } from '../../hooks/useIconos'

export const ButtonEdit = (props: ButtonProps) => {

    const { onClick } = props
    const { IconEdit } = useIconos()

    return (
        <Button
            {...props}
            variant='text'
            shape='default'
            icon={<IconEdit style={{ fontSize: 24 }} />}
            onClick={onClick}>
        </Button>
    )
}