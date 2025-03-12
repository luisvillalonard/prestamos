import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Col, Divider, Flex, Space, theme } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"
import TitlePage from "@components/titles/titlePage"

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
                <TitlePage title="Permisos" />
                <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />
                <Flex align="center" justify="space-between" className="mb-3">
                    <Space>
                        <Searcher size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                    </Space>
                    <Space>
                        <ButtonPrimary onClick={onNew}>Nuevo Perf&iacute;l</ButtonPrimary>
                    </Space>
                </Flex>
                <Listado filter={filter} />
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}