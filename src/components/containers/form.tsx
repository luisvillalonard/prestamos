import { Button, Drawer, Space, Form } from "antd"
import { Store } from "antd/es/form/interface"
import { useConstants } from "../../hooks/useConstants"
import { useIconos } from "../../hooks/useIconos"

type FormDrawerProps = {
    name: string,
    title: string,
    open: boolean,
    vertical?: boolean,
    size?: "large" | "default",
    placement?: 'left' | 'right' | 'top' | 'bottom',
    loading?: boolean,
    initialValues?: Store,
    children: JSX.Element[] | JSX.Element,
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void,
    onFinish: (values: any) => void,
}

const FormDrawer = (props: FormDrawerProps) => {
    const { 
        name, title, open, vertical, size, placement, loading, initialValues, children,
        onClose, onFinish
    } = props
    const { IconClose } = useIconos()
    const { Colors } = useConstants()

    return (
        <Drawer
            placement={placement}
            size={size}
            open={open}
            closable={false}
            onClose={onClose}
            title={<div className="fs-4 fw-lighter">{title}</div>} 
            getContainer={false}
            extra={
                <Space>
                    <Button key="1" type="text" shape="circle" htmlType="button" icon={<IconClose color={Colors.White} className="fs-4" />} onClick={onClose} />
                    <Button key="2" shape="round" type="primary" htmlType="submit" form={name} loading={loading}>Guardar</Button>
                </Space>
            }
            styles={{
                header: {
                    paddingLeft: 10,
                    paddingRight: 10,
                }
            }}>
            <Form
                name={name}
                layout={vertical ? "vertical" : "horizontal"}
                autoComplete="off"
                size="large"
                initialValues={initialValues}
                onFinish={onFinish}>
                    { children }
            </Form>
        </Drawer>
    )
}
export default FormDrawer;
