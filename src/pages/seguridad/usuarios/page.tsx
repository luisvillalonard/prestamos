import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { Col, Divider, Flex, Space, theme } from "antd"
import { useState } from "react"
import FormUsuario from "./form"
import Listado from "./listado"
import TitlePage from "@components/titles/titlePage"
import { Colors } from "@hooks/useConstants"

export default function PageUsuarios() {

    const { contextUsuarios: { state: { modelo, procesando }, nuevo } } = useData()
    const [filter, setFilter] = useState<string>('')
    const { token } = theme.useToken()

    return (
        <>
            <Col span={24}>
                <TitlePage title="Usuarios" />
                <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />
                <Flex align="center" justify="space-between" className="mb-3">
                    <Space>
                        <Searcher size="large" onChange={setFilter} style={{ borderColor: token.colorBorderSecondary }} />
                    </Space>
                    <Space>
                        <ButtonPrimary onClick={nuevo}>Nuevo Usuario</ButtonPrimary>
                    </Space>
                </Flex>
                <Listado filter={filter} />
                {!modelo ? <></> : <FormUsuario />}
            </Col>
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}