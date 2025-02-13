import { ButtonPrimary } from "@components/buttons/primary"
import { Col, Space, Typography } from "antd"
import Listado from "./listado"
import Container from "@components/containers/container"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { useState } from "react"
import Loading from "@components/containers/loading"
import { useNavigate } from "react-router-dom"
import { useConstants } from "@hooks/useConstants"

export default function PagePrestamos() {

    const { contextPrestamosEstados: { state: { procesando } } } = useData()
    const [filter, setFilter] = useState<string>('')
    const nav = useNavigate()
    const { Urls } = useConstants()
    const { Title } = Typography

    return (
        <>
            <Col span={24}>
                <Title level={2} style={{ fontWeight: 300 }}>Prestamos Registrados</Title>
                <Container
                    title={
                        <Searcher variant="borderless" size="large" onChange={setFilter} />
                    }
                    extra={
                        <Space>
                            <ButtonPrimary onClick={() => nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Formulario}`, { replace: true })}>Nuevo Prestamo</ButtonPrimary>
                        </Space>
                    }>
                    <Listado filter={filter} />
                </Container>
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}