import { ButtonPrimary } from "@components/buttons/primary"
import FormItem from "@components/forms/item"
import InputDate from "@components/inputs/date"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { IconCheck, IconCalculator } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatNumber } from "@hooks/useUtils"
import { Cliente } from "@interfaces/clientes"
import { Prestamo, PrestamoCuota } from "@interfaces/prestamos"
import { Alert, Button, Card, Col, Collapse, Divider, Flex, Form, Input, InputNumber, InputRef, Row, Select, Space, Table, Tag } from "antd"
import { CSSProperties, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PrestamoCuotas from "./cuotas"
import TitlePage from "@components/titles/titlePage"
import TitlePanel from "@components/titles/titlePanel"
import Searcher from "@components/inputs/searcher"
import { ButtonDefault } from "@components/buttons/default"

const styleInputTotal: CSSProperties = {
    borderRadius: 0, fontWeight: 'bold', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: Colors.Secondary
}

export default function FormPrestamo() {

    const {
        contextClientes: { state: { datos: clientes, procesando }, todos },
        contextPrestamos: { state: { modelo }, nuevo, agregar },
        contextPrestamosEstados: { todos: cargarEstados },
        contextFormasPago: { state: { datos: formasPago }, todos: cargarFormasPago },
        contextMetodosPago: { state: { datos: metodosPago }, todos: cargarMetodosPago },
        contextMonedas: { state: { datos: monedas }, todos: cargarMonedas },
        contextAcesores: { state: { datos: acesores }, todos: cargarAcesores },
    } = useData()
    const { entidad, editar } = useForm<Prestamo | undefined>(modelo)
    const [errores, setErrores] = useState<string[]>([])
    const [filtroCliente, setFiltroCliente] = useState<string>('')
    const [montoCapitalCuota, setMontoCapitalCuota] = useState<number>(0)
    const [montoTotalInteres, setMontoTotalInteres] = useState<number>(0)
    const [montoAmortizacion, setMontoAmortizacion] = useState<number>(0)
    const searchRef = useRef<InputRef>(null)
    const { codigo } = useParams()
    const nav = useNavigate()

    const cargarAuxiliares = async () => await Promise.all([
        cargarFormasPago(),
        cargarMetodosPago(),
        cargarMonedas(),
        cargarAcesores(),
        cargarEstados()
    ])

    const buscarCliente = async () => {

        if (filtroCliente) {
            await todos({
                pageSize: 999999,
                currentPage: 1,
                filter: filtroCliente
            })

        }
    }

    const calcularCuotas = () => {

        if (!entidad) return;

        if (entidad.deudaInicial && entidad.interes && entidad.cantidadCuotas) {

            let saldoFinal: number = entidad.deudaInicial;
            const totalIntereses = entidad.deudaInicial * (entidad.interes / 100);
            setMontoTotalInteres(totalIntereses);

            const capitalCuota = Number((entidad.deudaInicial / entidad.cantidadCuotas).toFixed(2));
            setMontoCapitalCuota(capitalCuota);

            const interesCuota = Number(Number(totalIntereses / entidad.cantidadCuotas).toFixed(2))
            setMontoAmortizacion(capitalCuota + interesCuota);

            const cuotas = Array.from(Array(entidad.cantidadCuotas).keys()).map(() => {

                saldoFinal = Number((saldoFinal - capitalCuota).toFixed(2));
                return {
                    fechaPago: entidad.fechaCredito,
                    deudaInicial: entidad.deudaInicial,
                    capital: capitalCuota,
                    interes: interesCuota, // dividir aqui entre las formas de pago
                    amortizacion: Number((interesCuota + capitalCuota).toFixed(2)),
                    saldoFinal: saldoFinal < 0 ? 0 : saldoFinal,
                } as PrestamoCuota

            });
            editar({
                ...entidad,
                cuotas: cuotas
            })

        }

    }

    const validaPrestamo = () => {

        if (!entidad) return false;

        const alertas: string[] = [];

        if (!entidad.cliente || !entidad.cliente.id || entidad.cliente.id <= 0)
            alertas.push('Debe establecer el cliente del prestamo.');

        if (entidad.cuotas.length === 0)
            alertas.push('Debe calcular las cuotas del prestamo.');

        setErrores(alertas);
        return alertas.length === 0;
    }

    const guardar = async () => {

        if (!entidad) {
            Alerta('Debe completar los campos obligatorios del formulario antes de guardar.');
            return;
        }
        if (!validaPrestamo()) return;

        let resp;
        try {
            resp = await agregar(entidad);
        } catch (error: any) {
            Alerta(error.message || 'Situación inesperada tratando de guardar los datos del prestamo.');
        }

        if (!resp) {
            editar(entidad);
            Alerta('Situación inesperada tratando de guardar los datos del prestamo.');
        } else if (!resp.ok) {
            editar(entidad);
            Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del prestamo.');
        } else {
            Exito(
                'Préstamo registrado exitosamente!',
                () => nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`)
            );
        }

    }

    useEffect(() => { buscarCliente() }, [filtroCliente])
    useEffect(() => { if (!codigo || !Number(codigo)) nuevo() }, [])
    useEffect(() => {
        editar(modelo);
        if (modelo) {
            cargarAuxiliares()
        }
    }, [modelo])
    useEffect(() => { searchRef && searchRef.current && searchRef.current.focus() }, [searchRef])

    return (
        <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

            <Flex align="center" justify="space-between">
                <TitlePage title="Formulario de C&aacute;lculo y Registro de Prestamo" />
                <ButtonPrimary size="large" htmlType="submit" form="FormPrestamo">
                    {entidad && entidad.id > 0 ? 'Actualizar' : 'Guardar'}
                </ButtonPrimary>
            </Flex>
            <Divider className='my-3' />

            <>
                {
                    errores.length === 0
                        ? <></>
                        :
                        <Alert
                            type="error"
                            closable={false}
                            showIcon
                            description={errores.length === 0 ? <></> : <ul className="m-0 ps-3">{errores.map((err, indexKey) => <li key={indexKey}>{err}</li>)}</ul>}
                            message={<h1 className="fs-5" style={{ color: Colors.Danger }}>Alerta</h1>}
                            className="mb-3"
                            style={{ borderLeftWidth: 6, borderLeftColor: Colors.Danger }}
                        />
                }
            </>

            <Form
                name="FormPrestamo"
                layout="vertical"
                autoComplete="off"
                size="large"
                disabled={false}
                initialValues={{
                    ...entidad,
                    formaPagoId: entidad?.formaPago?.id,
                    metodoPagoId: entidad?.metodoPago?.id,
                    monedaId: entidad?.moneda?.id,
                    acesorId: entidad?.acesor?.id,
                }}
                onFinish={guardar}>

                <Card
                    size="small"
                    title={<TitlePanel title="Datos del Cliente" color={Colors.Primary} />}
                    extra={<Searcher variant="borderless" value={filtroCliente} onChange={setFiltroCliente} />}
                    className="mb-4 position-relative">
                    <Space split={<Divider type="vertical" className="h-100 d-inline" style={{ borderColor: Colors.Secondary }} />}>
                        <Flex vertical>
                            <strong color={Colors.Secondary}>C&oacute;digo Empleado</strong>
                            <span>{entidad?.cliente?.empleadoId || 'Desconocido'}</span>
                        </Flex>
                        <Flex vertical>
                            <strong color={Colors.Secondary}>Nombres y Apellidos</strong>
                            <span>{`${entidad?.cliente?.nombres || ''} ${entidad?.cliente?.apellidos || ''}`.trim() || 'Desconocido'}</span>
                        </Flex>
                        <Flex vertical>
                            <strong color={Colors.Secondary}>Tel&eacute;fono Celular</strong>
                            <span>{entidad?.cliente?.telefonoCelular || 'Desconocido'}</span>
                        </Flex>
                        <Flex vertical>
                            <strong color={Colors.Secondary}>Ocupaci&oacute;n</strong>
                            <span>{entidad?.cliente?.ocupacion?.nombre || 'Desconocido'}</span>
                        </Flex>
                    </Space>
                    <Collapse
                        bordered={false} ghost size="small" destroyInactivePanel
                        defaultActiveKey={['1']}
                        activeKey={[filtroCliente.length > 0 ? '1' : '']}
                        items={[
                            {
                                key: '1',
                                label: null,
                                showArrow: false,
                                styles: {
                                    header: { padding: 0 },
                                    body: { paddingLeft: 0, paddingRight: 0 }
                                },
                                children: <>
                                    <Table<Cliente>
                                        size="middle"
                                        bordered={false}
                                        loading={procesando}
                                        locale={{ emptyText: <Flex style={{ textWrap: 'nowrap' }}>0 clientes</Flex> }}
                                        dataSource={procesando ? [] : clientes.map((item, index) => { return { ...item, key: index + 1 } })}>
                                        <Table.Column title="#" align="center" fixed='left' width={60} render={(record: Cliente) => (
                                            <ButtonDefault size="small" shape="circle" icon={<IconCheck />} onClick={() => {
                                                if (entidad) {
                                                    console.log('entidad', entidad)
                                                    console.log('cliente', record)
                                                    editar({ ...entidad, cliente: record })
                                                    setFiltroCliente('')
                                                }
                                            }} />
                                        )} />
                                        <Table.Column title="Código" dataIndex="codigo" key="codigo" fixed='left' width={80} />
                                        <Table.Column title="Empleado Id" dataIndex="empleadoId" key="empleadoId" width={100} />
                                        <Table.Column title="Nombres y Apellidos" fixed='left' render={(record: Cliente) => (
                                            `${record.nombres || ''} ${record.apellidos || ''}`.trim()
                                        )} />
                                        <Table.Column title="Documento" render={(record: Cliente) => (
                                            <span style={{ textWrap: 'nowrap' }}>{`(${record.documentoTipo?.nombre}) ${record.documento}`}</span>
                                        )} />
                                    </Table>
                                </>,
                            },
                        ]}
                    >
                    </Collapse>
                </Card>

                <Card
                    size="small"
                    className="mb-4"
                    title={<TitlePanel title="Datos del Prestamo" color={Colors.Primary} />}
                    extra={
                        <Flex align="center" gap={10}>
                            <TitlePanel title="C&oacute;digo" />
                            <Tag color='blue' style={{ fontWeight: 'bolder', fontSize: 16, borderRadius: 10 }}>{entidad?.codigo || 'P-000000'}</Tag>
                        </Flex>
                    }>
                    <Row gutter={[10, 10]}>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem name="deudaInicial" label="Monto" rules={[{ required: true, message: 'Obligatorio' }]}>
                                <InputNumber
                                    name="deudaInicial"
                                    value={entidad?.deudaInicial}
                                    style={{ width: '100%' }}
                                    onChange={(value) => {
                                        if (entidad && value) {
                                            editar({ ...entidad, deudaInicial: value })
                                        }
                                    }} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem name="interes" label="Interes (%)" rules={[{ required: true, message: 'Obligatorio' }]}>
                                <InputNumber
                                    name="interes"
                                    value={entidad?.interes}
                                    style={{ width: '100%' }}
                                    onChange={(value) => {
                                        if (entidad && value) {
                                            editar({ ...entidad, interes: value })
                                        }
                                    }} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem name="cantidadCuotas" label="N&uacute;mero Cuotas" rules={[{ required: true, message: 'Obligatorio' }]}>
                                <InputNumber
                                    name="cantidadCuotas"
                                    value={entidad?.cantidadCuotas}
                                    style={{ width: '100%' }}
                                    onChange={(value) => {
                                        if (entidad && value) {
                                            editar({ ...entidad, cantidadCuotas: value })
                                        }
                                    }} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem name="formaPagoId" label="Forma de Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Select
                                    allowClear
                                    value={entidad?.formaPago?.id}
                                    options={formasPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                    onChange={(value) => {
                                        if (entidad) {
                                            editar({ ...entidad, formaPago: formasPago.filter(opt => opt.id === value).shift() });
                                        }
                                    }} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem name="metodoPagoId" label="M&eacute;todo Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Select
                                    allowClear
                                    value={entidad?.metodoPago?.id}
                                    options={metodosPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                    onChange={(value) => {
                                        if (entidad) {
                                            editar({ ...entidad, metodoPago: metodosPago.filter(opt => opt.id === value).shift() });
                                        }
                                    }} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem name="monedaId" label="Tipo Moneda" rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Select
                                    allowClear
                                    value={entidad?.moneda?.id}
                                    options={monedas.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                    onChange={(value) => {
                                        if (entidad) {
                                            editar({ ...entidad, moneda: monedas.filter(opt => opt.id === value).shift() });
                                        }
                                    }} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem name="fechaCredito" label="Fecha emisi&oacute;n" rules={[{ required: true, message: 'Obligatorio' }]}>
                                <InputDate
                                    name="fechaCredito"
                                    placeholder=""
                                    value={entidad?.fechaCredito || ''}
                                    onChange={(date) => {
                                        if (entidad) {
                                            editar({ ...entidad, fechaCredito: date.format('DD-MM-YYYY') })
                                        }
                                    }} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem name="acesorId" label="Acesor">
                                <Select
                                    allowClear
                                    value={entidad?.acesor?.id}
                                    options={acesores.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                    onChange={(value) => {
                                        if (entidad) {
                                            editar({ ...entidad, acesor: acesores.filter(opt => opt.id === value).shift() });
                                        }
                                    }} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem label="Monto Cuota">
                                <Input disabled variant="borderless" value={FormatNumber(montoCapitalCuota, 2)} style={styleInputTotal} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem label="Total Interes">
                                <Input disabled variant="borderless" value={FormatNumber(montoTotalInteres, 2)} style={styleInputTotal} />
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={8} sm={24} xs={24}>
                            <FormItem label="Monto a Pagar">
                                <Input disabled variant="borderless" value={FormatNumber(montoAmortizacion, 2)} style={styleInputTotal} />
                            </FormItem>
                        </Col>
                    </Row>
                </Card>

                <Card
                    size="small"
                    className="mb-4"
                    title={<TitlePanel title="Informaci&oacute;n de Cr&eacute;dito" color={Colors.Primary} />}
                    extra={<Button size="middle" type="link" icon={<IconCalculator />} onClick={calcularCuotas}>Calcular</Button>}>
                    <PrestamoCuotas cuotas={entidad?.cuotas ?? []} />
                </Card>

            </Form>
        </Col>
    )
}