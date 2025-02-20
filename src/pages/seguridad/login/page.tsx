import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { UserApp } from "@interfaces/seguridad"
import { Card, Col, Divider, Flex, Layout, theme, Typography } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import FormCambioClave from "./cambioClave"
import LoginForm from "./form"

export default function PageLogin() {

    const { contextAuth: { LoggedIn } } = useData()
    const [user, setUser] = useState<UserApp | null>(null)
    const { token } = theme.useToken()
    const nav = useNavigate()
    const { Title } = Typography

    useEffect(() => {
        if (user && user.cambio && user.activo) {
            LoggedIn(user);
            nav(Urls.Home, { replace: true });
        }
    }, [user])

    return (
        <Layout className="vh-100 body-login">
            <Flex
                align="center"
                justify="center"
                className="h-100">
                <Col md={18} sm={20} xs={22} style={{ alignItems: 'center' }}>
                    <Col xl={{ span: 8, offset: 14 }} lg={{ span: 10, offset: 14 }} md={{ span: 12, offset: 12 }} sm={24} xs={24}>
                        <Card style={{ position: 'relative' }}>
                            <Flex vertical align="center">
                                <Flex vertical align="center" gap={0}>
                                    <Title level={1} style={{ fontWeight: 'bolder', margin: 0, marginBottom: 6, color: token.colorPrimary }}>Prestamos</Title>
                                    <Title level={3} style={{ fontWeight: 'lighter', margin: 0 }}>Inicio de Sesión</Title>
                                </Flex>
                                <Divider className="my-3" />
                                {
                                    !user
                                        ? <LoginForm onChange={setUser} />
                                        : !user.cambio
                                            ? <FormCambioClave onChange={setUser} userLogin={user} />
                                            : <></>
                                }
                            </Flex>
                        </Card>
                    </Col>
                </Col>
            </Flex>
        </Layout>
    )
}