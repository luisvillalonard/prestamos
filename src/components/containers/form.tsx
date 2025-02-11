import { Button, Space, Form, Modal, ModalProps } from "antd"
import { Store } from "antd/es/form/interface"
import { FormProps } from "react-router-dom"
import { ButtonDefault } from "@components/buttons/default"

/* type FormDrawerProps = {
    name: string,
    title: string,
    open: boolean,
    vertical?: boolean,
    loading?: boolean,
    children: JSX.Element[] | JSX.Element,
} */

const FormModal = (props: FormProps & Omit<ModalProps, "onFinish"> & {
    initialValues?: Store,
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void,
    onFinish: (values: any) => void,
}) => {

    const {
        name, title, open, loading, initialValues, children,
        onClose, onFinish
    } = props

    return (
        <Modal
            title={<div className="fs-4 fw-lighter">{title}</div>}
            centered
            open={open}
            closable={false}
            onCancel={onClose}
            getContainer={false}
            footer={
                <Space>
                    <ButtonDefault key="1" htmlType="button" onClick={onClose}>Cerrar</ButtonDefault>
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
                layout="vertical"
                autoComplete="off"
                size="large"
                initialValues={initialValues}
                onFinish={onFinish}>
                {children}
            </Form>
        </Modal>
    )
}
export default FormModal;
