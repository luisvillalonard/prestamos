import { ButtonPrimary } from "@components/buttons/primary"
import { ButtonSuccess } from "@components/buttons/success"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import TitlePage from "@components/titles/titlePage"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { exportarPrestamosExcel } from "@hooks/useFile"
import { IconExcel } from "@hooks/useIconos"
import { Col, Divider, Flex, Space, theme } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"
import Container from "@components/containers/container"

export default function PagePrestamos() {

    const { contextPrestamos: { state: { datos, procesando } } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { token } = theme.useToken()
    const nav = useNavigate()

    const onNew = () => nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Formulario}`)

    return (
        <>
            <Col span={24}>
                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Prestamos Registrados" />
                    <Space>
                        <Searcher key="1" size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                        <ButtonSuccess key="2" size="large" onClick={() => exportarPrestamosExcel(datos)} icon={<IconExcel style={{ display: 'flex', fontSize: 20 }} />}>Exportar Excel</ButtonSuccess>
                        <ButtonPrimary key="3" size="large" onClick={onNew}>Nuevo Prestamo</ButtonPrimary>
                    </Space>
                </Flex>
                <Container>
                    <Listado filter={filter} />
                </Container>
            </Col>
            <Loading fullscreen active={procesando} message="Procesando, espere..." />
        </>
    )
}