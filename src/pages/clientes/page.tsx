import { ButtonPrimary } from "@components/buttons/primary"
import { Col, Row, Typography } from "antd"
import Listado from "./listado"

export default function PageClientes() {

    const { Title } = Typography

    return (
        <>
            <Row>
                <Col flex="auto">
                    <Title level={3}>Clientes Registrados</Title>
                </Col>
                <Col flex="none">
                    <ButtonPrimary>Exportar</ButtonPrimary>
                </Col>
            </Row>
            <Listado />
        </>
    )
}