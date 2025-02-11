import { ButtonPrimary } from "@components/buttons/primary"
import Searcher from "@components/inputs/searcher"
import { Space, Typography } from "antd"
import Listado from "./listado"
import { useState } from "react"
import Container from "@components/containers/container"
import { useData } from "@hooks/useData"
import Loading from "@components/containers/loading"
import FormUsuario from "./form"

export default function PageUsuarios() {

    const { contextUsuarios: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { Title } = Typography

    return (
        <>
            <Title level={2} style={{ fontWeight: 300 }}>Usuarios</Title>
            <Container
                title={
                    <Searcher size="large" onChange={setFilter} />
                }
                extra={
                    <Space>
                        <ButtonPrimary onClick={nuevo}>Nuevo</ButtonPrimary>
                    </Space>
                }>
                <Listado filter={filter} />
            </Container>
            <Loading active={procesando} message="Procesando, espere..." />
            {
                !modelo
                    ? <></>
                    : <FormUsuario />
            }
        </>
    )
}