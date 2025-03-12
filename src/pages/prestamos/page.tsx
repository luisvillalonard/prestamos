import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Col, Divider, Flex, Space, theme } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"
import TitlePage from "@components/titles/titlePage"
import { ButtonSuccess } from "@components/buttons/success"
import { exportarPrestamosExcel } from "@hooks/useFile"
import { IconExcel } from "@hooks/useIconos"

export default function PagePrestamos() {

    const { contextPrestamos: { state: { datos, procesando } } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { token } = theme.useToken()
    const nav = useNavigate()

    const onNew = () => {
        nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Formulario.replace(':id', '0')}`);
    }

    return (
        <>
            <Col span={24}>
                <TitlePage title="Prestamos Registrados" />
                <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />
                <Flex align="center" justify="space-between" className="mb-3">
                    <Space>
                        <Searcher size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                    </Space>
                    <Space>
                        <ButtonSuccess onClick={() => exportarPrestamosExcel(datos)} icon={<IconExcel style={{ display: 'flex', fontSize: 20 }} />}>Exportar Excel</ButtonSuccess>
                        <ButtonPrimary onClick={onNew}>Nuevo Prestamo</ButtonPrimary>
                    </Space>
                </Flex>
                <Listado filter={filter} />
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}