import FormItem from "@components/forms/item";
import { useData } from "@hooks/useData";
import { useForm } from "@hooks/useForm";
import { useIconos } from "@hooks/useIconos";
import { ControlProps } from "@interfaces/globales";
import { Login } from "@interfaces/seguridad";
import { Alert, Button, Checkbox, Flex, Form, Input } from "antd";
import { useState } from "react";

export default function LoginForm(props: Pick<ControlProps, "onChange">) {

    const { onChange } = props
    const { contextAuth: { state: { procesando }, validar } } = useData()
    const { IconUser, IconPassword, IconLoading } = useIconos()
    const { entidad: user } = useForm<Login>({ acceso: '', clave: '', recuerdame: true })
    const [mensaje, setMensaje] = useState<string>('')

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
        <>
            {
                mensaje
                    ? <Alert type="error" closable={false} showIcon message={mensaje} style={{ width: '100%', marginBottom: 20 }} />
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
                <FormItem name="acceso" rules={[{ required: true, message: 'Obligatorio', }]}>
                    <Input
                        name="acceso"
                        value={user.acceso}
                        readOnly={procesando}
                        prefix={<IconUser style={{ fontSize: 20 }} />}
                        placeholder="coloque aqui el usuario"
                        style={{ marginBottom: 18 }} />
                </FormItem>
                <FormItem name="clave" rules={[{ required: true, message: 'Obligatorio' }]}>
                    <Input.Password
                        name="clave"
                        value={user.clave}
                        readOnly={procesando}
                        prefix={<IconPassword style={{ fontSize: 20 }} />}
                        placeholder="coloque aqui la clave"
                        style={{ marginBottom: 18 }} />
                </FormItem>
                <Form.Item>
                    <Button block type="primary" shape="round" htmlType="submit" disabled={procesando}>
                        {
                            procesando
                                ?
                                <Flex gap={10}>
                                    <IconLoading style={{ fontSize: 22 }} />
                                    <span>Validando, espere...</span>
                                </Flex>
                                : <span>Iniciar Sesi&oacute;n</span>
                        }
                    </Button>
                </Form.Item>
                <FormItem>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="recuerdame" valuePropName="checked" noStyle>
                            <Checkbox value={user.recuerdame}>Recuerdame</Checkbox>
                        </Form.Item>
                        <a href="">Recuperar Clave</a>
                    </Flex>
                </FormItem>
            </Form>
        </>
    )
}