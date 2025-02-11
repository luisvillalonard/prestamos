import { ButtonPrimary } from "@components/buttons/primary"
import Searcher from "@components/inputs/searcher"
import { Card, Space, Typography } from "antd"
import Listado from "./listado"
//import { useData } from "@hooks/useData"

export default function PageUsuarios() {

    //const { contextUsuarios: { state: { procesando }, nuevo } } = useData()
    const { Title } = Typography

    return (
        <>
            <Title level={3}>Usuarios</Title>
            <Card
                title={
                    <Space>
                        <Searcher />
                    </Space>
                }
                extra={
                    <Space>
                        <ButtonPrimary>Primary</ButtonPrimary>
                    </Space>
                }>
                <Listado />
            </Card>

        </>
    )
}