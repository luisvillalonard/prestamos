import { ButtonPrimary } from "@components/buttons/primary"
import Searcher from "@components/inputs/searcher"
import { Col, Space, Typography } from "antd"
import Listado from "./listado"
import { useState } from "react"
import Container from "@components/containers/container"
import { useData } from "@hooks/useData"
import Loading from "@components/containers/loading"
import FormCiudades from "./form"

export default function PageCiudades() {

    const { contextCiudades: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { Title } = Typography

    return (
        <Col span={18} offset={3}>
            <Title level={2} style={{ fontWeight: 300 }}>Ciudades</Title>
            <Container
                title={
                    <Searcher variant="borderless" size="large" onChange={setFilter} />
                }
                extra={
                    <Space>
                        <ButtonPrimary onClick={nuevo}>Nueva</ButtonPrimary>
                    </Space>
                }>
                <Listado filter={filter} />
            </Container>
            <Loading active={procesando} message="Procesando, espere..." />
            {
                !modelo
                    ? <></>
                    : <FormCiudades />
            }
        </Col>
    )
}