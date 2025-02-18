import Container from "@components/containers/container"
import InputDate from "@components/inputs/date"
import InputNumbers from "@components/inputs/numbers"
import InputText from "@components/inputs/text"
import InputSelect from "@components/selects/select"
import { useConstants } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { useIconos } from "@hooks/useIconos"
import { navUrl } from "@hooks/useUtils"
import { Cliente } from "@interfaces/clientes"
import { Prestamo } from "@interfaces/prestamos"
import { Button, Col, Form, Input, InputRef, Row, Select, Space, Typography } from "antd"
import { useEffect, useRef } from "react"
import PrestamoCuotas from "./cuotas"

export default function FormPrestamo() {

    const {
        contextPrestamos: { state: { modelo, editando } },
        contextDocumentosTipos: { state: { datos: documentosTipos }, todos: cargarDocumentosTipos },
        contextFormasPago: { state: { datos: formasPago }, todos: cargarFormasPago },
        contextMetodosPago: { state: { datos: metodosPago }, todos: cargarMetodosPago },
        contextMonedas: { state: { datos: monedas }, todos: cargarMonedas },
        contextAcesores: { state: { datos: acesores }, todos: cargarAcesores },
    } = useData()
    const { entidad, editar } = useForm<Prestamo | undefined>(modelo)
    const searchRef = useRef<InputRef>(null)
    const { Urls } = useConstants()
    const { IconCalculator } = useIconos()
    const { Title } = Typography
    const { Search } = Input

    const cargarAuxiliares = async () => await Promise.all([
        cargarDocumentosTipos(),
        cargarFormasPago(),
        cargarMetodosPago(),
        cargarMonedas(),
        cargarAcesores()
    ])

    useEffect(() => { cargarAuxiliares() }, [])
    useEffect(() => {
        if (editando) {
            navUrl(`/${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`)
        }
    }, [editando])

    return (
        <Col span={20} offset={2}>
            <Title level={2} style={{ fontWeight: 300 }}>Formulario de C&aacute;lculo y Registro de Prestamo</Title>
            <Form
                name="FormPrestamo"
                layout="vertical"
                autoComplete="off"
                size="large"
                initialValues={{
                    ...modelo,
                    formaPagoId: modelo?.formaPago?.id,
                    metodoPagoId: modelo?.metodoPago?.id,
                    monedaId: modelo?.moneda?.id,
                    acesorId: modelo?.acesor?.id,
                }}>

                <Row gutter={[10, 10]}>

                    <Col lg={6} md={7} sm={24} xs={24}>
                        <Container title="C&oacute;digo de Prestamo" style={{ height: '100%' }}>
                            <Row gutter={[10, 10]}>
                                <Col xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="N&uacute;mero Prestamo" value={entidad?.codigo} disabled />
                                </Col>
                                <Col xs={24} style={{ alignSelf: 'end' }}>
                                    {
                                        entidad?.id === 0
                                            ?
                                            <InputDate
                                                name="fechaCredito"
                                                label="Fecha (que fecha es?)"
                                                placeholder=""
                                                value={undefined}
                                                onChange={(date) => {
                                                    if (entidad) {
                                                        editar({ ...entidad, fechaCredito: !date ? new Date().toISOString().substring(0, 10) : date.toISOString().substring(0, 10) })
                                                    }
                                                }} />
                                            :
                                            <InputText label="Fecha (que fecha es?)" value={entidad?.fechaCredito} disabled />
                                    }
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col lg={18} md={17} sm={24} xs={24}>
                        <Container title="Datos del Cliente" style={{ height: '100%' }}>
                            <Row gutter={[10, 10]}>
                                <Col lg={8} md={24} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <label style={{ marginBottom: 6 }}>Documento</label>
                                    <Space.Compact style={{ width: '100%' }}>
                                        <Select
                                            options={documentosTipos.map(tipo => ({ key: tipo.id, value: tipo.id, label: tipo.nombre }))}
                                            style={{ width: 90 }}
                                            onChange={(value: number) => {
                                                if (entidad) {
                                                    editar({ ...entidad, cliente: { documentoTipo: documentosTipos.filter(opt => opt.id === value).shift() } as Cliente });
                                                    if (searchRef && searchRef.current) {
                                                        searchRef.current.focus();
                                                    }
                                                }
                                            }} />
                                        <Search
                                            ref={searchRef}
                                            value={entidad?.cliente?.documento || ''}
                                            onChange={(evt) => {
                                                if (entidad) {
                                                    editar({ ...entidad, cliente: { documento: evt.target.value } as Cliente })
                                                }
                                            }} />
                                    </Space.Compact>
                                </Col>
                                <Col lg={16} md={24} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Nombres y Apellidos"
                                        value={`${entidad?.cliente?.nombres || ''} ${entidad?.cliente?.apellidos || ''}`.trim()} />
                                </Col>
                                <Col lg={8} md={12} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="C&oacute;digo Empleado" value={entidad?.cliente?.empleadoId} />
                                </Col>
                                <Col lg={8} md={12} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Tel&eacute;fono Celular" value={entidad?.cliente?.telefonoCelular} />
                                </Col>
                                <Col lg={8} md={24} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputText label="Ocupaci&oacute;n" value={entidad?.cliente?.ocupacion?.nombre} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col xs={24}>
                        <Container title="Informaci&oacute;n de Cr&eacute;dito">
                            <Row gutter={[10, 10]}>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputNumbers name="deudaInicial" label="Monto Pr&eacute;stamo" value={entidad?.deudaInicial}
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, deudaInicial: Number(value) ?? 0 })
                                            }
                                        }} />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputNumbers name="interes" label="Interes Mensual (%)" value={entidad?.interes}
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, deudaInicial: Number(value) ?? 0 })
                                            }
                                        }} />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputNumbers name="cuotas" label="N&uacute;mero Cuotas" value={entidad?.cuotas}
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, deudaInicial: Number(value) ?? 0 })
                                            }
                                        }} />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputSelect
                                        name="formaPagoId"
                                        label="Forma de Pago"
                                        allowClear
                                        value={entidad?.formaPago?.id}
                                        options={formasPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, formaPago: formasPago.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputSelect
                                        name="metodoPagoId"
                                        label="M&eacute;todo de Pago"
                                        allowClear
                                        value={entidad?.metodoPago?.id}
                                        options={metodosPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, metodoPago: metodosPago.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputSelect
                                        name="monedaId"
                                        label="Tipo de Moneda"
                                        allowClear
                                        value={entidad?.moneda?.id}
                                        options={monedas.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, moneda: monedas.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputNumbers label="Monto Cuota" value={0} disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputNumbers label="Total Interes" value={0} disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputNumbers label="Monto a Pagar" value={0} disabled />
                                </Col>
                                <Col lg={{ flex: '20%' }} md={{ flex: '25%' }} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                    <InputSelect
                                        name="acesorId"
                                        label="Acesor"
                                        allowClear
                                        value={entidad?.acesor?.id}
                                        options={acesores.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, acesor: acesores.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col xs={24}>
                        <Container
                            title="Cuotas"
                            extra={
                                <Space>
                                    <Button color="primary" variant="outlined" size="middle" shape="round" icon={<IconCalculator />}>Calcular</Button>
                                </Space>
                            }>
                            <PrestamoCuotas />
                        </Container>
                    </Col>
                </Row>

            </Form>
        </Col>
    )
}