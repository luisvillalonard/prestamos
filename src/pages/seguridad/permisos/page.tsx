import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Col, Divider, Flex, Typography, theme } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"

export default function PagePermisos() {

    const { contextPermisos: { state: { procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const nav = useNavigate()
    const { Title } = Typography
    const { token } = theme.useToken()

    const onNew = () => {
        nuevo();
        nav(`/${Urls.Seguridad.Base}/${Urls.Seguridad.PermisosFormulario}`, { replace: true });
    }

    return (
        <>
            <Col span={24}>
                <Flex align="center" justify="space-between">
                    <Title level={3} style={{ fontWeight: 'bolder', marginBottom: 0, color: token.colorPrimary }}>Permisos</Title>
                    <ButtonPrimary size="large" onClick={onNew}>Nuevo Perf&iacute;l</ButtonPrimary>
                </Flex>
                <Divider className='my-3' />
                <Flex align="center" justify="flex-end" className="w-100 mb-3">
                    <Searcher size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                </Flex>
                <Listado filter={filter} />
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}