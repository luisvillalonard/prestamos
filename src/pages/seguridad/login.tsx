import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { useIconos } from "@hooks/useIconos"
import { navUrl } from "@hooks/useUtils"
import { ResponseResult } from "@interfaces/globales"
import { Login, UserApp } from "@interfaces/seguridad"
import { Alert, Button, Card, Checkbox, Col, Divider, Flex, Form, Input, Layout, theme } from "antd"
import { useState } from "react"

export default function PageLogin() {

    const { contextAuth: { state: { procesando }, validar } } = useData()
    const { token: { colorPrimary } } = theme.useToken()
    const { IconUser, IconLock, IconLoading } = useIconos()
    const { entidad: user } = useForm<Login>({ acceso: '', clave: '', recuerdame: true })
    const [result, setResult] = useState<ResponseResult<UserApp> | null>(null)

    const onFinish = async (values: Login) => {

        const resp = await validar(values)
        if (!resp.ok) {
            setResult(resp)
            return
        }
        navUrl(Urls.Home)

    };

    return (
        <Layout
            className="vh-100 body-login">
            <Flex
                align="center"
                justify="center"
                className="h-100">
                <Col md={18} sm={20} xs={22} style={{ alignItems: 'center' }}>
                    <Col xl={{ span: 8, offset: 14 }} lg={{ span: 10, offset: 14 }} md={{ span: 12, offset: 12 }} sm={24} xs={24}>
                        <Card
                            style={{ position: 'relative' }}
                            styles={{
                                body: {
                                    padding: 20
                                }
                            }}>
                            <Flex
                                vertical
                                align="center">
                                <Flex vertical align="center" gap={0}>
                                    <span className="display-5" style={{ fontWeight: 'bold', color: colorPrimary }}>Prestamos</span>
                                </Flex>
                                <p className="fs-4 m-0" style={{ textAlign: 'center' }}>Inicio de Sesi&oacute;n</p>
                                <Divider className="my-3" />
                                {
                                    result && !result.ok
                                        ? <Alert type="error" closable={false} showIcon message={result.mensaje} className="w-100 mb-3" />
                                        : <></>
                                }
                                <Form
                                    name="formLogin"
                                    size="large"
                                    layout="vertical"
                                    className="w-100"
                                    initialValues={user}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        name="acceso"
                                        required={false}
                                        rules={[{ required: true, message: 'Obligatorio', }]}
                                    >
                                        <Input
                                            name="acceso"
                                            autoComplete="off"
                                            value={user.acceso}
                                            readOnly={procesando}
                                            prefix={<IconUser className="fs-5" />}
                                            placeholder="coloque aqui el usuario" />
                                    </Form.Item>
                                    <Form.Item
                                        name="clave"
                                        required={false}
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                        style={{ marginBottom: 8 }}
                                    >
                                        <Input
                                            name="clave"
                                            type="password"
                                            autoComplete="off"
                                            value={user.clave}
                                            readOnly={procesando}
                                            prefix={<IconLock className="fs-5" />}
                                            placeholder="coloque aqui la clave" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Flex justify="space-between" align="center">
                                            <Form.Item name="recuerdame" valuePropName="checked" noStyle>
                                                <Checkbox value={user.recuerdame}>Recuerdame</Checkbox>
                                            </Form.Item>
                                            <a href="">Recuperar Clave</a>
                                        </Flex>
                                    </Form.Item>
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
                                </Form>
                            </Flex>
                        </Card>
                    </Col>
                </Col>
            </Flex>
        </Layout>
    )
}