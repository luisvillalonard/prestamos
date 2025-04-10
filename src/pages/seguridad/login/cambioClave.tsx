import { useData } from "@hooks/useData";
import { useForm } from "@hooks/useForm";
import { useIconos } from "@hooks/useIconos";
import { ControlProps } from "@interfaces/globales";
import { CambioClave, UserApp } from "@interfaces/seguridad";
import { Alert, Button, Divider, Flex, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";

export default function FormCambioClave(props: Pick<ControlProps, "onChange"> & { userLogin: UserApp }) {

    const { userLogin, onChange } = props
    const { contextUsuarios: { state: { procesando }, cambiarClave } } = useData()
    const { IconLoading, IconPassword } = useIconos()
    const { entidad: userCambio, editar, handleChangeInput } = useForm<CambioClave | undefined>({ id: 0, passwordNew: '', passwordConfirm: '' })
    const [mensaje, setMensaje] = useState<string>('')
    const { Title } = Typography

    const onFinish = async () => {

        if (userCambio) {
            setMensaje('');
            const result = await cambiarClave({ ...userCambio, id: userLogin.id });
            if (result) {
                if (result.ok) {
                    if (result.datos) {
                        onChange && onChange(result.datos);
                    }
                } else {
                    setMensaje(result.mensaje || 'Situación inesperada tratando de validar los datos del usuario.');
                }
            }
        }
    }

    useEffect(() => {
        if (userLogin && userCambio) {
            editar({
                ...userCambio,
                id: userLogin.id,
            })
        }
    }, [userLogin])

    return (
        <Flex vertical className="w-100">
            <Title level={2} style={{ margin: 0, fontWeight: 'lighter', textAlign: 'center' }}>Inicio Sesi&oacute;n</Title>
            <Divider />
            {
                mensaje
                    ? <Alert type="error" closable={false} showIcon message={mensaje} style={{ width: '100%', marginBottom: 30 }} />
                    : <Alert type="info" closable={false} showIcon message="Para poder acceder al sistema debe cambiar la clave de su usuario." style={{ width: '100%', marginBottom: 20 }} />
            }
            <Form
                name="formCambioClave"
                size="large"
                layout="vertical"
                autoComplete="off"
                initialValues={userCambio}
                onFinish={onFinish}
                style={{ width: '100%' }}
            >
                <Form.Item name="passwordNew" rules={[{ required: true, message: 'Obligatorio', }]}>
                    <Input.Password
                        name="passwordNew"
                        placeholder="escriva la nueva clave"
                        value={userCambio?.passwordNew || ''}
                        readOnly={procesando}
                        prefix={<IconPassword style={{ fontSize: 20 }} />}
                        style={{ marginBottom: 18 }}
                        onChange={handleChangeInput} />
                </Form.Item>
                <Form.Item name="passwordConfirm" rules={[{ required: true, message: 'Obligatorio' }]}>
                    <Input.Password
                        name="passwordConfirm"
                        placeholder="repita la nueva clave"
                        value={userCambio?.passwordConfirm || ''}
                        readOnly={procesando}
                        prefix={<IconPassword style={{ fontSize: 20 }} />}
                        style={{ marginBottom: 18 }}
                        onChange={handleChangeInput} />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" shape="round" htmlType="submit" disabled={procesando}>
                        {
                            procesando
                                ?
                                <Flex gap={10}>
                                    <IconLoading style={{ fontSize: 22 }} />
                                    <span>Procesando, espere...</span>
                                </Flex>
                                : <span>Cambiar CLave</span>
                        }
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    )
}