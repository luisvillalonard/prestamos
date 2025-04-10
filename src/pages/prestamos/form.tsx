import AlertStatic from "@components/alerts/alert"
import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import { InputDatePicker } from "@components/inputs/date"
import Searcher from "@components/inputs/searcher"
import TitlePage from "@components/titles/titlePage"
import TitlePanel from "@components/titles/titlePanel"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { dateFormat, DateList, String_To_Date } from "@hooks/useDate"
import { useForm } from "@hooks/useForm"
import { IconCalculator } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatNumber } from "@hooks/useUtils"
import { Cliente } from "@interfaces/clientes"
import { Configuracion } from "@interfaces/configuraciones"
import { DateArray } from "@interfaces/globales"
import { Prestamo, PrestamoCuota } from "@interfaces/prestamos"
import ClienteInfo from "@pages/clientes/info"
import { Button, Card, Col, Collapse, Flex, Form, Input, InputNumber, Row, Select, Space, Table, Tag, Typography } from "antd"
import { CSSProperties, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PrestamoCuotas from "./cuotas"

const styleInputTotal: CSSProperties = {
    borderRadius: 0, 
    fontWeight: 'bold', 
    borderBottomWidth: 1, 
    borderBottomStyle: 'solid', 
    borderBottomColor: Colors.Secondary
}

export default function FormPrestamo() {

    const {
        contextConfiguracionesGenerales: { ultima },
        contextClientes: { state: { datos: clientes, procesando: cargandoClientes }, todos },
        contextPrestamos: { state: { modelo, procesando: cargandoPrestamo }, nuevo, agregar, actual },
        contextPrestamosEstados: { todos: cargarEstados },
        contextFormasPago: { state: { datos: formasPago }, todos: cargarFormasPago },
        contextMetodosPago: { state: { datos: metodosPago }, todos: cargarMetodosPago },
        contextMonedas: { state: { datos: monedas }, todos: cargarMonedas },
        contextAcesores: { state: { datos: acesores }, todos: cargarAcesores },
    } = useData()
    const { entidad, editar } = useForm<Prestamo | undefined>(modelo)
    const [errores, setErrores] = useState<string[]>([])
    const [fechasPago, setFechasPago] = useState<DateArray[]>([])
    const [primeraFechaPago, setPrimeraFechaPago] = useState<string | undefined>(undefined)

    const [montoCapitalCuota, setMontoCapitalCuota] = useState<number>(0)
    const [montoTotalInteres, setMontoTotalInteres] = useState<number>(0)
    const [montoAmortizacion, setMontoAmortizacion] = useState<number>(0)
    const [activeKey, setActiveKey] = useState<string>('')
    const [configuracion, setConfiguracion] = useState<Configuracion | undefined>(undefined)
    const [isBlocked, setIsBlocked] = useState<boolean>(false)
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
        setConfiguracion(config);
    })

    const buscarCliente = async (texto: string) => {

        if (texto) {
            await todos({
                pageSize: 999999,
                currentPage: 1,
                filter: texto
            });
        }
        setActiveKey(!texto ? '' : '1');
    }

    const calcularFechaPago = () => {

        if (!(entidad && entidad.fechaCredito && entidad.formaPago)) {
            setFechasPago([]);
            return;
        }

        const fechaInicio = String_To_Date(entidad.fechaCredito);
        if (!fechaInicio) return;

        const dias = entidad.formaPago.dias.map(item => item.dia);
        const fechas = DateList(fechaInicio, dias, dias.length);

        setFechasPago(fechas);
        setPrimeraFechaPago(undefined);

    }

    const calcularCuotas = () => {

        if (!entidad) return;

        if (entidad.deudaInicial && entidad.interes && entidad.cantidadCuotas && primeraFechaPago) {

            if (!primeraFechaPago) {
                setErrores(['Debe seleccionar la fecha de inicio de pago.']);
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

            const dias = entidad.formaPago?.dias.map(item => item.dia) ?? [];
            const fechaInicio = String_To_Date(primeraFechaPago)!;
            const fechas = DateList(fechaInicio, dias, entidad.cantidadCuotas);
            const cuotas = Array.from(Array(entidad.cantidadCuotas).keys()).map((_num, index) => {

                saldoFinal = Number((saldoFinal - capitalCuota).toFixed(2));

                return {
                    fechaPago: fechas[index].fecha,
                    deudaInicial: entidad.deudaInicial,
                    capital: capitalCuota,
                    interes: interesCuota,
                    amortizacion: Number((interesCuota + capitalCuota).toFixed(2)),
                    saldoFinal: saldoFinal < 0 ? 0 : saldoFinal,
                    vencido: fechas[index].anterior,
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

    useEffect(() => { nuevo() }, [url.pathname])
    useEffect(() => {
        editar(modelo);
        if (modelo) { cargarAuxiliares() }
    }, [modelo])
    useEffect(() => { calcularFechaPago() }, [entidad?.fechaCredito, entidad?.formaPago])

    if (!entidad) {
        return <Loading fullscreen active message="Cargando parametros, espere" />
    }

    return (
        <>
            <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Formulario de C&aacute;lculo y Registro de Prestamo" />
                    <Space>
                        <ButtonDefault key="1" size="large" onClick={() => window.location.reload()}>Nuevo</ButtonDefault>
                        <ButtonPrimary key="2" size="large" htmlType="submit" form="FormPrestamo" disabled={isBlocked}>
                            {entidad && entidad.id > 0 ? 'Actualizar' : 'Guardar'}
                        </ButtonPrimary>
                    </Space>
                </Flex>

                <AlertStatic errors={errores} />

                <Form
                    name="FormPrestamo"
                    layout="vertical"
                    autoComplete="off"
                    size="large"
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
                        extra={<Searcher onChange={buscarCliente} />}
                        className="mb-4"
                        styles={{ body: { position: 'relative' }}}>
                        <ClienteInfo cliente={entidad.cliente} />
                        <Collapse
                            bordered={false} ghost size="small" 
                            destroyInactivePanel
                            defaultActiveKey={[activeKey]}
                            activeKey={[activeKey]}
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
                                            locale={{ emptyText: <Flex style={{ textWrap: 'nowrap' }}>0 clientes</Flex> }}
                                            dataSource={cargandoClientes ? [] : clientes.map((item, index) => { return { ...item, key: index + 1 } })}>
                                            <Table.Column title="Acci&oacute;n" align="center" fixed='left' width={60} render={(record: Cliente) => (
                                                <ButtonDefault size="small" shape="round" onClick={async () => {

                                                    setErrores([]);
                                                    setIsBlocked(false);

                                                    const result = await actual(record.id);
                                                    if (result && result.ok && result.datos) {
                                                        const prest = result.datos;
                                                        if (!prest?.estado?.final) {
                                                            setErrores(['Este cliente ya tiene un prestamo en curso. Si lo desea haga un reenganche.']);
                                                            setIsBlocked(true);
                                                            return;
                                                        }
                                                    }

                                                    if (entidad) {
                                                        editar({ ...entidad, cliente: record });
                                                        setIsBlocked(false);
                                                        setActiveKey('');
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
                        <Loading active={cargandoClientes} message="buscando, espere" />
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
                                <Form.Item name="deudaInicial" label="Monto" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputNumber
                                        name="deudaInicial"
                                        value={entidad?.deudaInicial}
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (entidad && value) {
                                                editar({ ...entidad, deudaInicial: value })
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="interes" label="Interes (%)" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputNumber
                                        name="interes"
                                        value={entidad?.interes}
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (entidad && value) {
                                                editar({ ...entidad, interes: value })
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="cantidadCuotas" label="N&uacute;mero Cuotas" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputNumber
                                        name="cantidadCuotas"
                                        value={entidad?.cantidadCuotas}
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (entidad && value) {
                                                editar({ ...entidad, cantidadCuotas: value })
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="formaPagoId" label="Forma de Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        allowClear
                                        value={entidad?.formaPago?.id}
                                        options={formasPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onClear={() => setFechasPago([])}
                                        onChange={(value) => {
                                            if (entidad) {
                                                const forma = formasPago.filter(opt => opt.id === value).shift()
                                                editar({ ...entidad, formaPago: forma })
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="metodoPagoId" label="M&eacute;todo Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
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
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="monedaId" label="Tipo Moneda" rules={[{ required: true, message: 'Obligatorio' }]}>
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
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="acesorId" label="Acesor">
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
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="fechaCredito" label="Fecha emisi&oacute;n" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputDatePicker
                                        name="fechaCredito"
                                        placeholder=""
                                        minDate={configuracion && configuracion.permiteFechaAnteriorHoy ? undefined : new Date()}
                                        value={entidad.fechaCredito}
                                        onChange={(date) => {
                                            if (entidad) {
                                                editar({ ...entidad, fechaCredito: !date ? '' : date.format(dateFormat) })
                                                setPrimeraFechaPago(undefined)
                                            }
                                        }}
                                        disabled={isBlocked} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="fechaInicioPago" label="Inicio de Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        value={primeraFechaPago}
                                        options={fechasPago.map((item, index) => {
                                            return { key: index, value: item.fecha, label: item.fecha }
                                        })}
                                        notFoundContent={''}
                                        disabled={isBlocked}
                                        onChange={setPrimeraFechaPago} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Monto Cuota">
                                    <Input disabled variant="borderless" value={FormatNumber(montoCapitalCuota, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Total Interes">
                                    <Input disabled variant="borderless" value={FormatNumber(montoTotalInteres, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Monto a Pagar">
                                    <Input disabled variant="borderless" value={FormatNumber(montoAmortizacion, 2)} style={styleInputTotal} />
                                </Form.Item>
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
            <Loading active={cargandoPrestamo} message="Procesando, espere..." />
        </>
    )
}
