import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Col, Flex, Space, theme } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"
import TitlePage from "@components/titles/titlePage"
import Container from "@components/containers/container"

export default function PagePermisos() {

    const { contextPermisos: { state: { procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const nav = useNavigate()
    const { token } = theme.useToken()

    const onNew = () => {
        nuevo();
        nav(`/${Urls.Seguridad.Base}/${Urls.Seguridad.PermisosFormulario}`, { replace: true });
    }

    return (
        <>
            <Col span={24}>
                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Permisos" />
                    <Space>
                        <Searcher key="1" size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                        <ButtonPrimary key="2" size="large" onClick={onNew}>Nuevo Perf&iacute;l</ButtonPrimary>
                    </Space>
                </Flex>
                <Container>
                    <Listado filter={filter} />
                </Container>
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}