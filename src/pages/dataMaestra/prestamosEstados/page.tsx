import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { Col, Flex, Space, theme } from "antd"
import { useState } from "react"
import FormPrestamoEstado from "./form"
import Listado from "./listado"
import TitlePage from "@components/titles/titlePage"
import Container from "@components/containers/container"

export default function PagePrestamosEstados() {

    const { contextPrestamosEstados: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { token } = theme.useToken()

    return (
        <>
            <Col span={18} offset={3}>
                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Estados de Prestamos" />
                    <Space>
                        <Searcher key="1" size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                        <ButtonPrimary key="2" size="large" onClick={nuevo}>Nuevo Estado de Prestamo</ButtonPrimary>
                    </Space>
                </Flex>
                <Container>
                    <Listado filter={filter} />
                </Container>
                {!modelo ? <></> : <FormPrestamoEstado />}
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}