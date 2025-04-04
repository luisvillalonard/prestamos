import Loading from "@components/containers/loading"
import { useData } from "@hooks/useData"
import { Card, Col, Divider, Flex, Form, Input, Row, Space, Table, Tabs, Tag } from "antd"
import { useNavigate, useParams } from "react-router-dom"
import { CSSProperties, useEffect, useState } from "react"
import TitlePage from "@components/titles/titlePage"
import { Colors, Urls } from "@hooks/useConstants"
import { useForm } from "@hooks/useForm"
import { Prestamo, PrestamoPago } from "@interfaces/prestamos"
import { Alerta, Exito } from "@hooks/useMensaje"
import TitlePanel from "@components/titles/titlePanel"
import Searcher from "@components/inputs/searcher"
import { ButtonDefault } from "@components/buttons/default"
import { IconCheck, IconListPoint, IconSearch } from "@hooks/useIconos"
import { FormatNumber } from "@hooks/useUtils"
import PrestamoCuotas from "../cuotas"
import AlertStatic from "@components/alerts/alert"

const styleInput: CSSProperties = {
    width: '100%', 
    borderRadius: 0, 
    fontWeight: 'bold', 
    borderBottomWidth: 1, 
    borderBottomStyle: 'solid', 
    borderBottomColor: Colors.Secondary
}

export default function PagePrestamoCobro() {

    const {
        contextPrestamos: { state: { datos: prestamosTodos, procesando: cargandoPrestamos }, todos },
        contextPrestamosPagos: { state: { modelo, procesando }, nuevo, agregar },
    } = useData()
    const { entidad, editar } = useForm<PrestamoPago | undefined>(modelo)
    const [errores, setErrores] = useState<string[]>([])
    const [prestamos, setPrestamos] = useState<Prestamo[]>([])
    const [prestamo, setPrestamo] = useState<Prestamo | undefined>(undefined)
    const [filtroPrestamo, setFiltroPrestamo] = useState<string>('')
    const [montoCapitalCuota, setMontoCapitalCuota] = useState<number>(0)
    const [montoTotalInteres, setMontoTotalInteres] = useState<number>(0)
    const [montoAmortizacion, setMontoAmortizacion] = useState<number>(0)
    const [activeKey, setActiveKey] = useState<string>('1')
    const { codigo } = useParams()
    const nav = useNavigate()

    const cargarPrestamos = async () => todos()

    const buscarPrestamo = async () => {

        if (filtroPrestamo) {
            const filtrados = prestamosTodos.filter((item => {
                return (item.codigo.toLowerCase().indexOf(filtroPrestamo) >= 0
                    || (item.cliente?.nombres || '').toLowerCase().indexOf(filtroPrestamo) >= 0
                    || (item.cliente?.apellidos || '').toLowerCase().indexOf(filtroPrestamo) >= 0
                    || (item.cliente?.documento || '').toLowerCase().indexOf(filtroPrestamo) >= 0)
            }))
            setPrestamos(filtrados)
            setMontoCapitalCuota(0)
            setMontoTotalInteres(0)
            setMontoAmortizacion(0)
        }
    }

    const validaPago = () => {

        if (!entidad) return false;

        const alertas: string[] = [];

        if (!entidad.id || entidad.id <= 0)
            alertas.push('No se ha establececido el prestamo para hacer el pago.');

        setErrores(alertas);
        return alertas.length === 0;
    }

    const guardar = async () => {

        if (!entidad) {
            Alerta('Debe completar los campos obligatorios del formulario antes de guardar.');
            return;
        }
        if (!validaPago()) return;

        let resp;
        try {
            resp = await agregar(entidad);
        } catch (error: any) {
            Alerta(error.message || 'Situación inesperada tratando de guardar los datos del pago de prestamo.');
        }

        if (!resp) {
            editar(entidad);
            Alerta('Situación inesperada tratando de guardar los datos del pago de prestamo.');
        } else if (!resp.ok) {
            editar(entidad);
            Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del pago de prestamo.');
        } else {
            Exito(
                'Pago de prestamo registrado exitosamente!',
                () => nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`)
            );
        }

    }

    useEffect(() => { buscarPrestamo() }, [filtroPrestamo])
    useEffect(() => { editar(modelo) }, [modelo])
    useEffect(() => {
        if (!codigo || !Number(codigo)) {
            nuevo()
        }
        cargarPrestamos()
    }, [])

    return (
        <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

            <TitlePage title="M&oacute;lculo de Cobros de Prestamo" />
            <Divider className='my-3' />

            <AlertStatic errors={errores} />

            <Tabs
                defaultActiveKey={activeKey}
                activeKey={activeKey}
                onChange={setActiveKey}
                items={[
                    {
                        key: '1',
                        label: 'Buscar Préstamo',
                        icon: <IconSearch />,
                        children: <Flex vertical>
                            <Space style={{ width: '100%', marginBottom: 8 }}>
                                <Searcher
                                    size="large"
                                    value={filtroPrestamo}
                                    onChange={setFiltroPrestamo}
                                    placeholder="buscar prestamo por c&oacute;digo, &oacute; empleado "
                                    style={{ width: '100%' }} />
                            </Space>
                            <Table<Prestamo>
                                size="middle"
                                bordered={false}
                                loading={cargandoPrestamos}
                                locale={{ emptyText: <Flex style={{ textWrap: 'nowrap' }}>0 prestamos</Flex> }}
                                dataSource={procesando ? [] : prestamos.map((item, index) => { return { ...item, key: index + 1 } })}>
                                <Table.Column title="#" align="center" fixed='left' width={60} render={(record: Prestamo) => (
                                    <ButtonDefault size="small" shape="circle" icon={<IconCheck />} onClick={() => {
                                        if (entidad) {
                                            console.log('entidad', entidad)
                                            console.log('prestamo', record)
                                            editar({ ...entidad, prestamoId: record.id })
                                            setPrestamo(record)
                                            setActiveKey('2')
                                        }
                                    }} />
                                )} />
                                <Table.Column title="Código" dataIndex="codigo" key="codigo" ellipsis />
                                <Table.Column title="Fecha Cr&eacute;dito" render={(record: Prestamo) => (<span style={{ textWrap: 'nowrap' }}>{record.fechaCredito}</span>)} />
                                <Table.Column title="Cliente" render={(record: Prestamo) => (`${record.cliente?.nombres} ${record.cliente?.apellidos}`.trim())} />
                                <Table.Column title="Monto" render={(record: Prestamo) => (FormatNumber(record.deudaInicial, 2))} />
                                <Table.Column title="Capital" render={(record: Prestamo) => (FormatNumber(Math.round(record.cuotas.reduce((acc, item) => { return acc + item.capital }, 0)), 2))} />
                                <Table.Column title="Inter&eacute;s" render={(record: Prestamo) => (FormatNumber(Math.round(record.cuotas.reduce((acc, item) => { return acc + item.interes }, 0)), 2))} />
                                <Table.Column title="M&eacute;todo de Pago" render={(record: Prestamo) => (record.metodoPago?.nombre)} />
                            </Table>
                        </Flex>
                    },
                    {
                        key: '2',
                        label: 'Formulario de Pago',
                        icon: <IconListPoint />,
                        disabled: !prestamo,
                        children: <Flex vertical>
                            <Form
                                name="FormPrestamo"
                                layout="vertical"
                                autoComplete="off"
                                size="large"
                                disabled={false}
                                initialValues={entidad}
                                onFinish={guardar}>
                                <Card
                                    size="small"
                                    title={<TitlePanel title="Datos del Pago" color={Colors.Primary} />}
                                    className="mb-4">

                                </Card>

                            </Form>

                            <Card
                                size="small"
                                title={<TitlePanel title="Datos del Cliente" color={Colors.Primary} />}
                                extra={<Searcher variant="borderless" value={filtroPrestamo} onChange={setFiltroPrestamo} />}
                                className="mb-4">
                                <Space split={<Divider type="vertical" className="h-100 d-inline" style={{ borderColor: Colors.Secondary }} />}>
                                    <Flex vertical>
                                        <strong color={Colors.Secondary}>C&oacute;digo Empleado</strong>
                                        <span>{prestamo?.cliente?.empleadoId || 'Desconocido'}</span>
                                    </Flex>
                                    <Flex vertical>
                                        <strong color={Colors.Secondary}>Nombres y Apellidos</strong>
                                        <span>{`${prestamo?.cliente?.nombres || ''} ${prestamo?.cliente?.apellidos || ''}`.trim() || 'Desconocido'}</span>
                                    </Flex>
                                    <Flex vertical>
                                        <strong color={Colors.Secondary}>Tel&eacute;fono Celular</strong>
                                        <span>{prestamo?.cliente?.telefonoCelular || 'Desconocido'}</span>
                                    </Flex>
                                    <Flex vertical>
                                        <strong color={Colors.Secondary}>Ocupaci&oacute;n</strong>
                                        <span>{prestamo?.cliente?.ocupacion?.nombre || 'Desconocido'}</span>
                                    </Flex>
                                </Space>
                            </Card>

                            <Card
                                size="small"
                                className="mb-4"
                                title={
                                    <Flex align="center" gap={10}>
                                        <TitlePanel title="Datos del Prestamo" color={Colors.Primary} />
                                        <Tag color='blue' style={{ fontSize: 16, borderRadius: 10 }}>{prestamo?.codigo || 'P-000000'}</Tag>
                                    </Flex>
                                }
                                extra={<Searcher variant="borderless" value={''} />}>
                                <Row gutter={[10, 10]}>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Monto</label>
                                            <Input size="large" readOnly value={FormatNumber(prestamo?.deudaInicial, 2)} style={styleInput} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Interes (%)</label>
                                            <Input size="large" readOnly value={FormatNumber(prestamo?.interes, 2)} style={styleInput} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>N&uacute;mero Cuotas</label>
                                            <Input size="large" readOnly value={FormatNumber(prestamo?.cantidadCuotas, 2)} style={styleInput} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Forma de Pago</label>
                                            <Input size="large" readOnly value={prestamo?.formaPago?.nombre} style={styleInput} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>M&eacute;todo Pago</label>
                                            <Input size="large" readOnly value={prestamo?.metodoPago?.nombre} style={styleInput} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Tipo Moneda</label>
                                            <Input size="large" readOnly value={prestamo?.moneda?.nombre} style={styleInput} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Fecha emisi&oacute;n</label>
                                            <Input size="large" readOnly value={prestamo?.fechaCredito} style={styleInput} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Acesor</label>
                                            <Input size="large" readOnly value={prestamo?.acesor?.nombre} style={styleInput} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Monto Cuota</label>
                                            <Input size="large" readOnly value={FormatNumber(montoCapitalCuota, 2)} style={{ ...styleInput, width: '100%' }} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Total Interes</label>
                                            <Input size="large" readOnly value={FormatNumber(montoTotalInteres, 2)} style={{ width: '100%' }} />
                                        </Flex>
                                    </Col>
                                    <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                        <Flex vertical>
                                            <label>Monto a Pagar</label>
                                            <Input size="large" readOnly value={FormatNumber(montoAmortizacion, 2)} style={{ width: '100%' }} />
                                        </Flex>
                                    </Col>
                                </Row>
                            </Card>

                            <Card
                                size="small"
                                className="mb-4"
                                title={<TitlePanel title="Informaci&oacute;n de Cr&eacute;dito" color={Colors.Primary} />}>
                                <PrestamoCuotas cuotas={prestamo?.cuotas ?? []} />
                            </Card>
                        </Flex>
                    }
                ]} />


            <Loading active={procesando} message="Procesando, espere..." />
        </Col>
    )
}