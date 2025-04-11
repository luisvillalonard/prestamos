import AlertStatic from "@components/alerts/alert"
import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import Searcher from "@components/inputs/searcher"
import TitlePage from "@components/titles/titlePage"
import TitlePanel from "@components/titles/titlePanel"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { IconListPoint, IconSearch } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatNumber } from "@hooks/useUtils"
import { Prestamo, PrestamoCuota, PrestamoPago } from "@interfaces/prestamos"
import { Card, Col, Divider, Flex, Form, Input, InputNumber, Row, Space, Table, Tabs, Tag } from "antd"
import { CSSProperties, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import PrestamoCuotas from "../cuotas"
import Container from "@components/containers/container"
import ClienteInfo from "@pages/clientes/info"

const styleInput: CSSProperties = {
    width: '100%',
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: Colors.Secondary
}

export default function PagePrestamoCobro() {

    const {
        contextPrestamos: { state: { procesando: cargandoPrestamos }, activos, porId },
        contextPrestamosPagos: { state: { modelo, procesando }, nuevo, editar: modificar, agregar },
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
    const { id } = useParams()
    const nav = useNavigate()
    const url = useLocation()

    const buscarPrestamo = async () => {

        if (filtroPrestamo) {
            const result = await activos({
                pageSize: 999999,
                currentPage: 1,
                filter: filtroPrestamo
            })
            if (result && result.ok) {
                setPrestamos(result.datos ?? [])
                setMontoCapitalCuota(0)
                setMontoTotalInteres(0)
                setMontoAmortizacion(0)
            }
        }
    }

    const cargarPrestamo = async (id: number) => {

        const result = await porId(id);
        if (result && result.ok) {

            const prest = result.datos;
            if (prest) {
                setPrestamo(prest);
                editar({
                    id: 0,
                    prestamoId: prest.id,
                    prestamoCuotaId: 0,
                    metodoPago: prest.metodoPago,
                    anulado: false,
                    monto: 0,
                    multaMora: 0,
                    usuario: undefined
                })
                setActiveKey('2')
            }
        }

    }

    const montoPendiente = (cuotas: PrestamoCuota[]): number => {

        cuotas.filter(cuota => !cuota.pagado)

        const total = cuotas
            .reduce((acc, item) => {
                return acc + item.pagos.reduce((accP, itemP) => { return accP + itemP.monto }, 0)
            }, 0)

        return Math.round(total)
    }

    const validaPago = () => {

        if (!entidad) return false;

        const alertas: string[] = [];

        if (!entidad || entidad.prestamoId <= 0)
            alertas.push('No se ha establececido el prestamo para hacer el pago.');

        if (entidad.monto <= 0)
            alertas.push('Debe indicar el monto a pagar.');

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
            modificar(entidad);
            Alerta('Situación inesperada tratando de guardar los datos del pago de prestamo.');
        } else if (!resp.ok) {
            modificar(entidad);
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
        if (!id || !Number(id)) {
            nuevo();
        } else {
            cargarPrestamo(Number(id));
        }
    }, [url.pathname, id])

    return (
        <>
            <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

                <TitlePage title="M&oacute;lculo de Cobros de Prestamo" />
                <Divider className='my-3' />

                <AlertStatic errors={errores} />

                <Container>
                    <Tabs
                        defaultActiveKey={activeKey}
                        activeKey={activeKey}
                        onChange={setActiveKey}
                        items={[
                            {
                                key: '1',
                                label: 'Buscar Préstamo',
                                icon: <IconSearch />,
                                children: <>
                                    <Flex vertical>
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
                                            locale={{ emptyText: <Flex style={{ textWrap: 'nowrap' }}>0 prestamos</Flex> }}
                                            dataSource={procesando ? [] : prestamos.map((item, index) => { return { ...item, key: index + 1 } })}>
                                            <Table.Column title="#" align="center" fixed='left' width={120} render={(record: Prestamo) => (
                                                <ButtonDefault
                                                    size="small"
                                                    shape="round"
                                                    onClick={() => {
                                                        if (entidad) {
                                                            setPrestamo(record)
                                                            editar({
                                                                ...entidad,
                                                                prestamoId: record.id,
                                                                metodoPago: record.metodoPago,
                                                            })
                                                            setActiveKey('2')
                                                        }
                                                    }}>Seleccionar</ButtonDefault>
                                            )} />
                                            <Table.Column title="Código" dataIndex="codigo" key="codigo" ellipsis />
                                            <Table.Column title="Fecha Cr&eacute;dito" render={(record: Prestamo) => (<span style={{ textWrap: 'nowrap' }}>{record.fechaCredito}</span>)} />
                                            <Table.Column title="Cliente" render={(record: Prestamo) => (`${record.cliente?.nombres} ${record.cliente?.apellidos}`.trim())} />
                                            <Table.Column title="Monto" render={(record: Prestamo) => (FormatNumber(record.deudaInicial, 2))} />
                                            <Table.Column title="Capital" render={(record: Prestamo) => (FormatNumber(record.capital, 2))} />
                                            <Table.Column title="Inter&eacute;s" render={(record: Prestamo) => (FormatNumber(Math.round(record.cuotas.reduce((acc, item) => { return acc + item.interes }, 0)), 2))} />
                                            <Table.Column title="Pendiente" render={(record: Prestamo) => (
                                                FormatNumber(record.deudaInicial - montoPendiente(record.cuotas), 2)
                                            )} />
                                            <Table.Column title="M&eacute;todo de Pago" render={(record: Prestamo) => (record.metodoPago?.nombre)} />
                                        </Table>
                                    </Flex>
                                </>
                            },
                            {
                                key: '2',
                                label: 'Formulario de Pago',
                                icon: <IconListPoint />,
                                disabled: !prestamo,
                                children: <Flex vertical>
                                    <Card
                                        size="small"
                                        title={<TitlePanel title="Datos del Pago" color={Colors.Primary} />}
                                        className="mb-4">
                                        <Form
                                            name="FormPrestamo"
                                            layout="vertical"
                                            autoComplete="off"
                                            size="large"
                                            disabled={false}
                                            initialValues={entidad}
                                            onFinish={guardar}>
                                            <Row gutter={[10, 10]}>
                                                <Col xl={6} lg={6} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                                    <Form.Item name="monto" label="Pago de Cuota" rules={[{ required: true, message: 'Obligatorio' }]}>
                                                        <InputNumber
                                                            size="large"
                                                            name="monto"
                                                            value={entidad?.monto}
                                                            style={{ width: '100%' }}
                                                            onFocus={(evt) => evt.currentTarget.select()}
                                                            onChange={(value) => {
                                                                if (entidad) {
                                                                    editar({ ...entidad, monto: value ?? 0 })
                                                                }
                                                            }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col xl={6} lg={6} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                                    <ButtonPrimary htmlType="submit">Pagar</ButtonPrimary>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Card>

                                    <Card
                                        size="small"
                                        title={<TitlePanel title="Datos del Cliente" color={Colors.Primary} />}
                                        className="mb-4">
                                        <ClienteInfo cliente={prestamo?.cliente} />
                                    </Card>

                                    <Card
                                        size="small"
                                        className="mb-4"
                                        title={
                                            <Flex align="center" gap={10}>
                                                <TitlePanel title="Datos del Prestamo" color={Colors.Primary} />
                                                <Tag color='blue' style={{ fontSize: 16, borderRadius: 10 }}>{prestamo?.codigo || 'P-000000'}</Tag>
                                            </Flex>
                                        }>
                                        <Row gutter={[10, 10]}>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Monto</strong>
                                                    <Input size="large" variant="borderless" readOnly value={FormatNumber(prestamo?.deudaInicial, 2)} style={styleInput} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Interes (%)</strong>
                                                    <Input size="large" variant="borderless" readOnly value={FormatNumber(prestamo?.interes, 2)} style={styleInput} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>N&uacute;mero Cuotas</strong>
                                                    <Input size="large" variant="borderless" readOnly value={FormatNumber(prestamo?.cantidadCuotas, 0)} style={styleInput} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Forma de Pago</strong>
                                                    <Input size="large" variant="borderless" readOnly value={prestamo?.formaPago?.nombre} style={styleInput} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>M&eacute;todo Pago</strong>
                                                    <Input size="large" variant="borderless" readOnly value={prestamo?.metodoPago?.nombre} style={styleInput} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Tipo Moneda</strong>
                                                    <Input size="large" variant="borderless" readOnly value={prestamo?.moneda?.nombre} style={styleInput} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Fecha emisi&oacute;n</strong>
                                                    <Input size="large" variant="borderless" readOnly value={prestamo?.fechaCredito} style={styleInput} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Acesor</strong>
                                                    <Input size="large" variant="borderless" readOnly value={prestamo?.acesor?.nombre} style={styleInput} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Monto Cuota</strong>
                                                    <Input size="large" variant="borderless" readOnly value={FormatNumber(montoCapitalCuota, 2)} style={{ ...styleInput, width: '100%' }} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Total Interes</strong>
                                                    <Input size="large" variant="borderless" readOnly value={FormatNumber(montoTotalInteres, 2)} style={{ ...styleInput, width: '100%' }} />
                                                </Flex>
                                            </Col>
                                            <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                                                <Flex vertical>
                                                    <strong>Monto a Pagar</strong>
                                                    <Input size="large" variant="borderless" readOnly value={FormatNumber(montoAmortizacion, 2)} style={{ ...styleInput, width: '100%' }} />
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
                </Container>
            </Col>
            <Loading
                fullscreen
                active={procesando || cargandoPrestamos}
                message={
                    procesando
                        ? 'Procesando, espere...'
                        : cargandoPrestamos
                            ? 'Buscando prestamos, espere...'
                            : ''
                } />
        </>
    )
}