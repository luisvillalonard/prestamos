import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { Col, Divider, Flex, Space, theme } from "antd"
import { useState } from "react"
import FormAcesor from "./form"
import Listado from "./listado"
import { Colors } from "@hooks/useConstants"
import TitlePage from "@components/titles/titlePage"

export default function PageAcesores() {

    const { contextAcesores: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { token } = theme.useToken()

    return (
        <>
            <Col span={18} offset={3}>
                <TitlePage title="Acesores" />
                <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />
                <Flex align="center" justify="space-between" className="mb-3">
                    <Space>
                        <Searcher size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                    </Space>
                    <Space>
                        <ButtonPrimary onClick={nuevo}>Nuevo Acesor</ButtonPrimary>
                    </Space>
                </Flex>
                <Listado filter={filter} />
                {!modelo ? <></> : <FormAcesor />}
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}