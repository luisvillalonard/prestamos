import { ButtonPrimary } from "@components/buttons/primary"
import { ButtonSuccess } from "@components/buttons/success"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { exportarClientesExcel } from "@hooks/useFile"
import { Col, Flex, Space, theme } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Listado from "./listado"
import TitlePage from "@components/titles/titlePage"
import { IconExcel, IconPlus } from "@hooks/useIconos"
import Container from "@components/containers/container"

export default function PageClientes() {

    const { contextClientes: { state: { datos, procesando, recargar, paginacion }, nuevo, todos } } = useData()
    const [filter, setFilter] = useState<string>('')
    const nav = useNavigate()
    const url = useLocation()
    const { token } = theme.useToken()

    const cargar = async () => {

        if (!paginacion) {
            await todos()

        } else {
            await todos({
                pageSize: paginacion.pageSize,
                currentPage: paginacion.currentPage,
                filter,
            })
        }
    };

    const onNew = () => {
        nuevo();
        nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, { replace: true });
    }

    useEffect(() => { cargar() }, [url.pathname, filter])
    useEffect(() => { if (recargar) cargar() }, [recargar])

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
                    <Listado />
                </Container>
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}