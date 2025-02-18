import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import InputText from "@components/inputs/text"
import { useData } from "@hooks/useData"
import { Col, Form, Input, Row, Typography } from "antd"
import PrestamoPagos from "./pagos"

export default function PagePrestamoCobro() {

    const { contextPrestamosPagos: { state: { procesando } } } = useData()
    const { Title } = Typography
    const { Search } = Input

    return (
        <Col span={20} offset={2}>
            <Title level={2} style={{ fontWeight: 300 }}>Cobro de Prestamo</Title>
            <Form
                name="FormCobroPrestamo"
                layout="vertical"
                autoComplete="off"
                size="large">

                <Row gutter={[10, 10]}>

                    <Col lg={6} md={7} sm={24} xs={24}>
                        <Container title="C&oacute;digo de Prestamo" style={{ height: '100%' }}>
                            <Row gutter={[10, 10]}>
                                <Col xs={24} style={{ alignSelf: 'end' }}>
                                    <label style={{ marginBottom: 6 }}>N&uacute;mero Prestamo</label>
                                    <Search />
                                </Col>
                                <Col xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Fecha" />
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col lg={18} md={17} sm={24} xs={24}>
                        <Container title="Datos del Cliente" style={{ height: '100%' }}>
                            <Row gutter={[10, 10]}>
                                <Col lg={8} md={24} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Documento" />
                                </Col>
                                <Col lg={16} md={24} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Nombres y Apellidos" />
                                </Col>
                                <Col lg={8} md={12} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="C&oacute;digo Empleado" />
                                </Col>
                                <Col lg={8} md={12} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Tel&eacute;fono Celular" />
                                </Col>
                                <Col lg={8} md={24} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Ocupaci&oacute;n" />
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col xs={24}>
                        <Container title="Informaci&oacute;n de Cr&eacute;dito">
                            <Row gutter={[10, 10]}>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Monto Pr&eacute;stamo" disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Interes Mensual (%)" disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="N&uacute;mero Cuotas" disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Forma de Pago" disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="M&eacute;todo de Pago" disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Tipo de Moneda" disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Monto Cuota" value={0} disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Total Interes" value={0} disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Monto a Pagar" value={0} disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Acesor" disabled />
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col xs={24}>
                        <Container title="Pagos">
                            <PrestamoPagos />
                        </Container>
                    </Col>
                </Row>

            </Form>
            <Loading active={procesando} message="Procesando, espere..." />
        </Col>
    )
}