import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Col, Divider, Flex, theme, Typography } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Listado from "./listado"

export default function PagePrestamos() {

    const { contextPrestamosEstados: { state: { procesando } } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { token } = theme.useToken()
    const nav = useNavigate()
    const { Title } = Typography

    const onNew = () => {
        nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Formulario.replace(':id', '0')}`);
    }

    return (
        <>
            <Col span={24}>
                <Flex align="center" justify="space-between">
                    <Title level={3} style={{ fontWeight: 'bolder', marginBottom: 0, color: token.colorPrimary }}>Prestamos Registrados</Title>
                    <ButtonPrimary size="large" onClick={onNew}>Nuevo Prestamo</ButtonPrimary>
                </Flex>
                <Divider className='my-3' />
                <Flex align="center" justify="flex-end" className="w-100">
                    <Searcher size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                </Flex>
                <Listado filter={filter} />
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}