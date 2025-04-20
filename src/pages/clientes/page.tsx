import { ButtonPrimary } from "@components/buttons/primary"
import { ButtonSuccess } from "@components/buttons/success"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import TitlePage from "@components/titles/titlePage"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { exportarClientesExcel } from "@hooks/useFile"
import { IconExcel, IconPlus } from "@hooks/useIconos"
import { Cliente } from "@interfaces/clientes"
import { Col, Flex, Space, theme } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"

export default function PageClientes() {

    const { contextClientes: { state: { datos, procesando } } } = useData()
    const [filter, setFilter] = useState<string>('')
    const nav = useNavigate()
    const { token } = theme.useToken()

    const onNew = () => nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Nuevo}`, { replace: true });

    return (
        <>
            <Col span={24}>
                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Clientes" />
                    <Space>
                        <Searcher key="1" size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                        <ButtonSuccess key="2" size="large" onClick={() => exportarClientesExcel(datos)} icon={<IconExcel style={{ display: 'flex', fontSize: 20 }} />}>Exportar Excel</ButtonSuccess>
                        <ButtonPrimary key="3" size="large" onClick={onNew} icon={<IconPlus />}>Nuevo Cliente</ButtonPrimary>
                    </Space>
                </Flex>
                <Container>
                    <Listado
                        filter={filter}
                        onClick={(cliente: Cliente) => {
                            nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Editar.replace(':id?', cliente.id.toString())}`, { replace: true })
                        }} />
                </Container>
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}