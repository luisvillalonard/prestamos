import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { Col, Flex, Space, theme } from "antd"
import { useState } from "react"
import FormMetodoPago from "./form"
import Listado from "./listado"
import TitlePage from "@components/titles/titlePage"
import Container from "@components/containers/container"

export default function PageMetodosPago() {

    const { contextMetodosPago: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { token } = theme.useToken()

    return (
        <>
            <Col span={18} offset={3}>
                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="M&eacute;todos de Pago" />
                    <Space>
                        <Searcher key="1" size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                        <ButtonPrimary key="2" size="large" onClick={nuevo}>Nuevo M&eacute;todo de Pago</ButtonPrimary>
                    </Space>
                </Flex>
                <Container>
                    <Listado filter={filter} />
                </Container>
                {!modelo ? <></> : <FormMetodoPago />}
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}