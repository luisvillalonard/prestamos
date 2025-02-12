import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { Col, Space, Typography } from "antd"
import { useState } from "react"
import FormUsuario from "./form"
import Listado from "./listado"

export default function PageUsuarios() {

    const { contextUsuarios: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { Title } = Typography

    return (
        <>
            <Col span={24}>
                <Title level={2} style={{ fontWeight: 300 }}>Usuarios</Title>
                <Container
                    title={
                        <Searcher variant="borderless" size="large" onChange={setFilter} />
                    }
                    extra={
                        <Space>
                            <ButtonPrimary onClick={nuevo}>Nuevo Usuario</ButtonPrimary>
                        </Space>
                    }>
                    <Listado filter={filter} />
                </Container>
                {
                    !modelo
                        ? <></>
                        : <FormUsuario />
                }
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}