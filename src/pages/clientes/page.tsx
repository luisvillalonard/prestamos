import { ButtonPrimary } from "@components/buttons/primary"
import { ButtonSuccess } from "@components/buttons/success"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { exportarClientesExcel } from "@hooks/useFile"
import { Col, Divider, Flex, Space, theme } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Listado from "./listado"
import TitlePage from "@components/titles/titlePage"
import { IconExcel } from "@hooks/useIconos"

export default function PageClientes() {

    const { contextClientes: { state, nuevo, todos } } = useData()
    const { datos, procesando, recargar, paginacion } = state
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
                <TitlePage title="Clientes" />
                <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />
                <Flex align="center" justify="space-between" className="mb-3">
                    <Space>
                        <Searcher size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                    </Space>
                    <Space>
                        <ButtonSuccess onClick={() => exportarClientesExcel(datos)} icon={<IconExcel style={{ display: 'flex', fontSize: 20 }} />}>Exportar Excel</ButtonSuccess>
                        <ButtonPrimary onClick={onNew}>Nuevo Cliente</ButtonPrimary>
                    </Space>
                </Flex>
                <Listado />
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}