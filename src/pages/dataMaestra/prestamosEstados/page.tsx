import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { Col, Space, Typography } from "antd"
import { useState } from "react"
import FormPrestamoEstado from "./form"
import Listado from "./listado"

export default function PagePrestamosEstados() {

    const { contextPrestamosEstados: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { Title } = Typography

    return (
        <>
            <Col span={18} offset={3}>
                <Title level={2} style={{ fontWeight: 300 }}>Estados de Prestamos</Title>
                <Container
                    title={
                        <Searcher variant="borderless" size="large" onChange={setFilter} />
                    }
                    extra={
                        <Space>
                            <ButtonPrimary onClick={nuevo}>Nuevo Estado</ButtonPrimary>
                        </Space>
                    }>
                    <Listado filter={filter} />
                </Container>
                {
                    !modelo
                        ? <></>
                        : <FormPrestamoEstado />
                }
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}