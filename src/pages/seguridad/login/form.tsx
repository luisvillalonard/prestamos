import { useData } from "@hooks/useData";
import { useForm } from "@hooks/useForm";
import { useIconos } from "@hooks/useIconos";
import { ControlProps } from "@interfaces/globales";
import { Login } from "@interfaces/seguridad";
import { Alert, Button, Checkbox, Divider, Flex, Form, Input, Typography } from "antd";
import { useState } from "react";

export default function LoginForm(props: Pick<ControlProps, "onChange">) {

    const { onChange } = props
    const { contextAuth: { state: { procesando }, validar } } = useData()
    const { IconUser, IconPassword } = useIconos()
    const { entidad: user } = useForm<Login>({ acceso: '', clave: '', recuerdame: true })
    const [mensaje, setMensaje] = useState<string>('')
    const { Title } = Typography

    const onFinish = async (login: Login) => {

        setMensaje('');
        const result = await validar(login);
        if (result) {
            if (result.ok) {
                if (result.datos) {
                    onChange && onChange(result.datos);
                }
            } else {
                setMensaje(result.mensaje || 'Situación inesperada tratando de validar los datos del usuario.');
            }
        } else {
            setMensaje('No fue posible validar los datos del usuario.');
        }
    }

    return (
        <Flex vertical className="w-100">
            <Title level={2} style={{ margin: 0, fontWeight: 'lighter', textAlign: 'center' }}>Inicio Sesi&oacute;n</Title>
            <Divider />
            {
                mensaje
                    ? <Alert type="error" closable={false} showIcon message={mensaje} style={{ width: '100%', marginBottom: 30 }} />
                    : <></>
            }
            <Form
                name="formLogin"
                size="large"
                layout="vertical"
                autoComplete="off"
                initialValues={user}
                onFinish={onFinish}
                style={{ width: '100%' }}
            >
                <Form.Item
                    name="acceso"
                    label={<Typography.Title level={5} style={{ margin: 0, fontWeight: 'lighter' }}>Usuario</Typography.Title>}
                    rules={[{ required: true, message: 'Obligatorio' }]}
                    style={{ marginBottom: 30 }}>
                    <Input
                        name="acceso"
                        value={user.acceso}
                        readOnly={procesando}
                        prefix={<IconUser style={{ fontSize: 30, marginRight: 20 }} />}
                        placeholder="escriba aqui el usuario" />
                </Form.Item>
                <Form.Item
                    name="clave"
                    label={<Typography.Title level={5} style={{ margin: 0, fontWeight: 'lighter' }}>Clave</Typography.Title>}
                    rules={[{ required: true, message: 'Obligatorio' }]}
                    style={{ marginBottom: 30 }}>
                    <Input.Password
                        name="clave"
                        value={user.clave}
                        readOnly={procesando}
                        prefix={<IconPassword style={{ fontSize: 30, marginRight: 20 }} />}
                        placeholder="escriba aqui la clave" />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" shape="round" htmlType="submit" loading={procesando}>
                        {procesando ? "Validando, espere..." : "Iniciar Sesión"}
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="recuerdame" valuePropName="checked" noStyle>
                            <Checkbox value={user.recuerdame} disabled={procesando}>Recuerdame</Checkbox>
                        </Form.Item>
                    </Flex>
                </Form.Item>
            </Form>
        </Flex>
    )
}