import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Col, Typography } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"

export default function PageClientes() {

    const { contextClientes: { state: { procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const nav = useNavigate()
    const { Title } = Typography

    const onNew = () => {
        nuevo();
        nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, { replace: true });
    }

    return (
        <>
            <Col span={24}>
                <Title level={2} style={{ fontWeight: 300 }}>Clientes</Title>
                <Container
                    title={
                        <Searcher variant="borderless" size="large" onChange={setFilter} />
                    }
                    extra={
                        <ButtonPrimary onClick={onNew}>Nuevo Cliente</ButtonPrimary>
                    }>
                    <Listado filter={filter} />
                </Container>
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}