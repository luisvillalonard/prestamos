import LabelInfo from "@components/labels/labelInfo";
import { FormatNumber } from "@hooks/useUtils";
import { Prestamo } from "@interfaces/prestamos";
import { Col, Flex, Row, Space, Switch } from "antd";

type PrestamoInfoProps = {
    prestamo?: Prestamo
}

export default function PrestamoInfo(props: PrestamoInfoProps) {

    const { prestamo } = props

    return (
        <Row gutter={[10, 10]}>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Monto</LabelInfo>
                    <span>{FormatNumber(prestamo?.monto ?? 0, 2)}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Interes (%)</LabelInfo>
                    <span>{FormatNumber(prestamo?.interes ?? 0, 2)}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Forma de Pago</LabelInfo>
                    <span>{prestamo?.formaPago?.nombre || 'Desconocida'}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>N&uacute;mero Cuotas</LabelInfo>
                    <span>{prestamo?.cuotas ?? 0}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>M&eacute;todo de Pago</LabelInfo>
                    <span>{prestamo?.metodoPago?.nombre || 'Desconocido'}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Moneda</LabelInfo>
                    <span>{prestamo?.moneda?.nombre || 'Desconocida'}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Acesor</LabelInfo>
                    <span>{prestamo?.acesor?.nombre || 'Desconocido'}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Fecha emisi&oacute;n</LabelInfo>
                    <span>{prestamo?.fechaCredito || 'Desconocida'}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Monto Cuota</LabelInfo>
                    <span>{FormatNumber(prestamo?.capitalCuota ?? 0, 2)}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Total Interes</LabelInfo>
                    <span>{FormatNumber(prestamo?.totalInteres ?? 0, 2)}</span>
                </Flex>
            </Col>
            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                <Flex vertical>
                    <LabelInfo>Monto a Pagar</LabelInfo>
                    <span>{FormatNumber(prestamo?.amortizacion ?? 0, 2)}</span>
                </Flex>
            </Col>
            <Col xs={24}>
                <Space>
                    <Switch
                        id="aplicaDescuento"
                        disabled
                        checked={prestamo?.aplicaDescuento ?? false} />
                    <span style={{ fontSize: 16 }}>Aplicar descuento extraordinario</span>
                </Space>
            </Col>
        </Row>
    )
}