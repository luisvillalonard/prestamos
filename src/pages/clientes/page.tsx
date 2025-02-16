import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useConstants } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Col, Space, Typography } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"

export default function PageClientes() {

    const { contextClientes: { state: { procesando, editando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const nav = useNavigate()
    const { Urls } = useConstants()
    const { Title } = Typography

    useEffect(() => {
        if (editando) {
            nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, { replace: true })
        }
    }, [editando])

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
                            <ButtonPrimary
                                onClick={nuevo}>
                                Nuevo Usuario
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