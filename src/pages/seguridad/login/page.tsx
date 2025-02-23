import bglogin from '@assets/bglogin.svg'
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { UserApp } from "@interfaces/seguridad"
import { Col, Divider, Flex, Image, Layout, Row, theme } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import FormCambioClave from './cambioClave'
import LoginForm from './form'

export default function PageLogin() {

    const { contextAuth: { LoggedIn } } = useData()
    const [user, setUser] = useState<UserApp | null>(null)
    const { token } = theme.useToken()
    const nav = useNavigate()

    useEffect(() => {
        if (user && user.cambio && user.activo) {
            LoggedIn(user);
            nav(Urls.Home, { replace: true });
        }
    }, [user])

    return (
        <Layout className="vh-100" style={{ backgroundColor: '#001529' }}>
            <Row style={{ height: '100%' }}>
                <Col xl={{ span: 15, order: 1 }} lg={{ span: 14, order: 1 }} md={{ span: 14, order: 1 }} sm={{ span: 24, order: 2 }} xs={{ span: 24, order: 2 }} style={{ alignSelf: 'center' }}>
                    <Col span={20} offset={2}>
                        <Flex vertical align='center'>
                            <Flex align='center' justify='center' gap={10}>
                                <h1 className='display-5' style={{ fontWeight: 'bolder', margin: 0, color: token.colorWhite }}>Sistema</h1>
                                <h1 className='display-5' style={{ fontWeight: 'bolder', margin: 0, color: token.colorPrimary }}>Prestamos</h1>
                            </Flex>
                            <Divider style={{ borderColor: token.colorWhite }} />
                            <Image preview={false} width='70%' src={bglogin} />
                        </Flex>
                    </Col>
                </Col>
                <Col xl={{ span: 9, order: 2 }} lg={{ span: 10, order: 2 }} md={{ span: 10, order: 2 }} sm={{ span: 24, order: 1 }} xs={{ span: 24, order: 1 }} style={{ backgroundColor: token.colorBgContainer }}>
                    <Flex vertical align="center" justify="center" className="h-100 p-5">
                        {
                            !user
                                ? <LoginForm onChange={setUser} />
                                : !user.cambio
                                    ? <FormCambioClave onChange={setUser} userLogin={user} />
                                    : <></>
                        }
                    </Flex>
                </Col>
            </Row>
        </Layout>
    )
}