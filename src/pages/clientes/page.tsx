import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { Col, Space, Typography } from "antd"
import { useEffect, useState } from "react"
import Listado from "./listado"
import { Urls } from "@hooks/useConstants"
import { navUrl } from "@hooks/useUtils"

export default function PageClientes() {

    const { contextClientes: { state: { procesando, editando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { Title } = Typography

    useEffect(() => {
        if (editando) {
            navUrl(`/${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`)
        }
    }, [editando])

    return (
        <>
            <Col span={24}>
                <Title level={2} style={{ fontWeight: 300 }}>Clientes</Title>
                <Container
                    title={
                        <Searcher variant="borderless" size="large" onChange={setFilter} />
                    }
                    extra={
                        <Space>
                            <ButtonPrimary
                                onClick={nuevo}>
                                Nuevo Cliente
                            </ButtonPrimary>
                        </Space>
                    }>
                    <Listado filter={filter} />
                </Container>
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}