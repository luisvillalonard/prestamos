import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { Col, Divider, Flex, theme, Typography } from "antd"
import { useState } from "react"
import FormDocumentoTipo from "./form"
import Listado from "./listado"

export default function PageDocumentosTipos() {

    const { contextDocumentosTipos: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { token } = theme.useToken()
    const { Title } = Typography

    return (
        <>
            <Col span={18} offset={3}>
                <Flex align="center" justify="space-between">
                    <Title level={3} style={{ fontWeight: 'bolder', marginBottom: 0, color: token.colorPrimary }}>Tipos de Documentos</Title>
                    <ButtonPrimary size="large" onClick={nuevo}>Nuevo Tipo de Documento</ButtonPrimary>
                </Flex>
                <Divider className='my-3' />
                <Flex align="center" justify="flex-end" className="w-100">
                    <Searcher size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                </Flex>
                <Listado filter={filter} />
                {!modelo ? <></> : <FormDocumentoTipo />}
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}