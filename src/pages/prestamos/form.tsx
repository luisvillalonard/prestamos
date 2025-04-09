import AlertStatic from "@components/alerts/alert"
import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import FormItem from "@components/forms/item"
import InputDate from "@components/inputs/date"
import Searcher from "@components/inputs/searcher"
import TitlePage from "@components/titles/titlePage"
import TitlePanel from "@components/titles/titlePanel"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { IconCalculator } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatDate_DDMMYYYY, FormatDate_YYYYMMDD, FormatNumber } from "@hooks/useUtils"
import { Cliente } from "@interfaces/clientes"
import { Prestamo, PrestamoCuota } from "@interfaces/prestamos"
import { Button, Card, Col, Collapse, Divider, Flex, Form, Input, InputNumber, InputRef, Row, Select, Space, Table, Tag, theme, Typography } from "antd"
import { CSSProperties, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PrestamoCuotas from "./cuotas"

const styleInputTotal: CSSProperties = {
    borderRadius: 0, fontWeight: 'bold', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: Colors.Secondary
}

export default function FormPrestamo() {

    const {
        contextConfiguracionesGenerales: { ultima },
        contextClientes: { state: { datos: clientes, procesando }, todos },
        contextPrestamos: { state: { modelo, procesando: cargandoPrestamo }, nuevo, agregar, actual },
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
    const [fechasPago, setFechasPago] = useState<Date[]>([])
    const [primeraFechaPago, setPrimeraFechaPago] = useState<string>('')
    const [minDate, setMinDate] = useState<Date | undefined>(undefined)
    const [isAlert, setIsAlert] = useState<boolean>(false)
    const [isBlocked, setIsBlocked] = useState<boolean>(false)
    const searchRef = useRef<InputRef>(null)
    const nav = useNavigate()
    const url = useLocation()

    const cargarAuxiliares = async () => await Promise.all([
        ultima(),
        cargarFormasPago(),
        cargarMetodosPago(),
        cargarMonedas(),
        cargarAcesores(),
        cargarEstados()
    ]).then((result) => {
        const config = result.shift()?.datos;
        const strDate = FormatDate_YYYYMMDD(new Date().toLocaleDateString('es-DO').substring(0, 10));
        if (strDate) {
            const [anio, mes, dia] = strDate.split('-')
            const fechaMinima = new Date(Number(anio), Number(mes), Number(dia) - 1);
            setMinDate(!config || !config.permiteFechaAnteriorHoy ? fechaMinima : undefined)
        }
    })

    const buscarCliente = async () => {

        if (filtroCliente) {
            await todos({
                pageSize: 999999,
                currentPage: 1,
                filter: filtroCliente
            })

        }
    }

    const calcularFechaPago = (dia: number): Date => {

        if (dia <= 0) return new Date()

        const fechaHoy = new Date()
        const diaDeHoy = fechaHoy.getDate()
        let mes = (fechaHoy.getMonth() + 1)
        let anio = fechaHoy.getFullYear()

        if (dia < diaDeHoy) {
            mes = fechaHoy.getMonth() + 2
            if ((fechaHoy.getMonth() + 2) === 1) {
                anio = fechaHoy.getFullYear() + 1
            }
        }

        return new Date(anio, mes, dia)

    }

    const getDateFormated = (date: Date) => FormatDate_DDMMYYYY(date.toISOString().substring(0, 10))

    const calcularCuotas = () => {

        if (!entidad) return;

        if (entidad.deudaInicial && entidad.interes && entidad.cantidadCuotas) {

            if (!primeraFechaPago) {
                setErrores(['Debe seleccionar la fecha de inicio de pago.']);
                setIsAlert(true);
                return;
            }
            setErrores([]);

            let saldoFinal: number = entidad.deudaInicial;
            const totalIntereses = entidad.deudaInicial * (entidad.interes / 100);
            setMontoTotalInteres(totalIntereses);

            const capitalCuota = Number((entidad.deudaInicial / entidad.cantidadCuotas).toFixed(2));
            setMontoCapitalCuota(capitalCuota);

            const interesCuota = Number(Number(totalIntereses / entidad.cantidadCuotas).toFixed(2))
            setMontoAmortizacion(capitalCuota + interesCuota);

            const [dia, mes, anio] = primeraFechaPago.split('-');
            const date = new Date(Number(anio), Number(mes) - 1, Number(dia));
            const dias = entidad.formaPago?.dias.map(item => item.dia) ?? [];
            let fechas: string[] = [];
            let vencidas: boolean[] = [];

            fechas.push(`${dia}-${mes}-${anio}`);
            while (fechas.length < entidad?.cantidadCuotas) {
                date.setDate(date.getDate() + 1);
                if (dias.filter(num => num === date.getDate()).length > 0) {
                    const nuevaFecha = FormatDate_DDMMYYYY(date.toISOString().substring(0, 10))
                    if (nuevaFecha) {
                        fechas.push(nuevaFecha);
                        vencidas.push(date < new Date() ? true : false);
                    }
                }
            }

            const cuotas = Array.from(Array(entidad.cantidadCuotas).keys()).map((_num, index) => {

                saldoFinal = Number((saldoFinal - capitalCuota).toFixed(2));

                return {
                    fechaPago: fechas[index],
                    deudaInicial: entidad.deudaInicial,
                    capital: capitalCuota,
                    interes: interesCuota,
                    amortizacion: Number((interesCuota + capitalCuota).toFixed(2)),
                    saldoFinal: saldoFinal < 0 ? 0 : saldoFinal,
                    vencido: vencidas[index],
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

        setIsAlert(false);
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
    useEffect(() => { nuevo() }, [])
    useEffect(() => {
        editar(modelo);
        if (modelo) { cargarAuxiliares() }
    }, [modelo, url.pathname])
    useEffect(() => { searchRef && searchRef.current && searchRef.current.focus() }, [searchRef])

    return (
        <>
            <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Formulario de C&aacute;lculo y Registro de Prestamo" />
                    <Space>
                        <ButtonPrimary size="large" htmlType="submit" form="FormPrestamo">
                            {entidad && entidad.id > 0 ? 'Actualizar' : 'Guardar'}
                        </ButtonPrimary>
                    </Space>
                </Flex>

                <AlertStatic errors={errores} isAlert={isAlert} />

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
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Datos del Cliente</Typography.Title>}
                        extra={<Searcher value={filtroCliente} onChange={setFiltroCliente} />}
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
                                            <Table.Column title="Acci&oacute;n" align="center" fixed='left' width={60} render={(record: Cliente) => (
                                                <ButtonDefault size="small" shape="round" onClick={async () => {
                                                    const result = await actual(record.id);
                                                    if (result && result.ok) {
                                                        const prest = result.datos;
                                                        if (!prest?.estado?.final) {
                                                            setErrores(['Este cliente ya tiene un prestamo en curso. Si lo desea haga un reenganche.']);
                                                            setIsAlert(true);
                                                            setIsBlocked(true);
                                                            return;
                                                        }
                                                    }

                                                    if (entidad) {
                                                        editar({ ...entidad, cliente: record });
                                                        setIsBlocked(false);
                                                        setFiltroCliente('')
                                                    }
                                                }}>Seleccionar</ButtonDefault>
                                            )} />
                                            <Table.Column title="Código" dataIndex="codigo" key="codigo" fixed='left' width={80} />
                                            <Table.Column title="Empleado Id" dataIndex="empleadoId" key="empleadoId" width={100} />
                                            <Table.Column title="Nombres y Apellidos" render={(record: Cliente) => (
                                                `${record.nombres || ''} ${record.apellidos || ''}`.trim()
                                            )} />
                                            <Table.Column title="Documento" render={(record: Cliente) => (
                                                <span style={{ textWrap: 'nowrap' }}>{`(${record.documentoTipo?.nombre}) ${record.documento}`}</span>
                                            )} />
                                            <Table.Column title="Sexo" render={(record: Cliente) => (record.sexo?.nombre)} />
                                            <Table.Column title="Ciudad" render={(record: Cliente) => (record.ciudad?.nombre)} />
                                            <Table.Column title="Ocupaci&oacute;n" render={(record: Cliente) => (record.ocupacion?.nombre)} />
                                            <Table.Column title="Celular" render={(record: Cliente) => (
                                                <span style={{ textWrap: 'nowrap' }}>{record.telefonoCelular}</span>
                                            )} />
                                        </Table>
                                    </>,
                                },
                            ]}
                        >
                        </Collapse>
                    </Card>

                    <Card
                        className="mb-4"
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Datos del Prestamo</Typography.Title>}
                        extra={
                            <Flex align="center" gap={10}>
                                <TitlePanel title="C&oacute;digo" />
                                <Tag color='blue' style={{ fontWeight: 'bolder', fontSize: 16, borderRadius: 10 }}>{entidad?.codigo || 'P-000000'}</Tag>
                            </Flex>
                        }>
                        <Row gutter={[10, 10]}>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="deudaInicial" label="Monto" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputNumber
                                        name="deudaInicial"
                                        value={entidad?.deudaInicial}
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (entidad && value) {
                                                editar({ ...entidad, deudaInicial: value })
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="interes" label="Interes (%)" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputNumber
                                        name="interes"
                                        value={entidad?.interes}
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (entidad && value) {
                                                editar({ ...entidad, interes: value })
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="cantidadCuotas" label="N&uacute;mero Cuotas" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputNumber
                                        name="cantidadCuotas"
                                        value={entidad?.cantidadCuotas}
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (entidad && value) {
                                                editar({ ...entidad, cantidadCuotas: value })
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="formaPagoId" label="Forma de Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        allowClear
                                        value={entidad?.formaPago?.id}
                                        options={formasPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (entidad) {
                                                const forma = formasPago.filter(opt => opt.id === value).shift()
                                                editar({ ...entidad, formaPago: forma })
                                                if (forma) {
                                                    const fechas = forma.dias.map(item => calcularFechaPago(item.dia))
                                                    setFechasPago(fechas.sort((a, b) => (a < b ? -1 : 1)))
                                                }
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="metodoPagoId" label="M&eacute;todo Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        allowClear
                                        value={entidad?.metodoPago?.id}
                                        options={metodosPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, metodoPago: metodosPago.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="monedaId" label="Tipo Moneda" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        allowClear
                                        value={entidad?.moneda?.id}
                                        options={monedas.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, moneda: monedas.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="acesorId" label="Acesor">
                                    <Select
                                        allowClear
                                        value={entidad?.acesor?.id}
                                        options={acesores.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        notFoundContent={''}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, acesor: acesores.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="fechaCredito" label="Fecha emisi&oacute;n" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputDate
                                        name="fechaCredito"
                                        placeholder=""
                                        minDate={minDate}
                                        defaultValue={new Date()}
                                        disabled={isBlocked}
                                        value={entidad?.fechaCredito || ''}
                                        onChange={(date) => {
                                            if (entidad) {
                                                editar({ ...entidad, fechaCredito: date.format('DD-MM-YYYY') })
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem name="fechaInicioPago" label="Inicio de Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        options={fechasPago.map((item, index) => {
                                            const fecha = getDateFormated(item)!
                                            return { key: index, value: fecha, label: fecha }
                                        })}
                                        notFoundContent={''}
                                        disabled={isBlocked}
                                        onChange={setPrimeraFechaPago} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem label="Monto Cuota">
                                    <Input disabled variant="borderless" value={FormatNumber(montoCapitalCuota, 2)} style={styleInputTotal} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem label="Total Interes">
                                    <Input disabled variant="borderless" value={FormatNumber(montoTotalInteres, 2)} style={styleInputTotal} />
                                </FormItem>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <FormItem label="Monto a Pagar">
                                    <Input disabled variant="borderless" value={FormatNumber(montoAmortizacion, 2)} style={styleInputTotal} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>

                    <Card
                        className="mb-4"
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Informaci&oacute;n de Cr&eacute;dito</Typography.Title>}
                        extra={<Button type="link" icon={<IconCalculator />} onClick={calcularCuotas} disabled={isBlocked}>Calcular</Button>}>
                        <PrestamoCuotas cuotas={entidad?.cuotas ?? []} />
                    </Card>

                </Form>
            </Col>
            <Loading active={cargandoPrestamo} message="Cargando Prestamo, espere..." />
        </>
    )
}
