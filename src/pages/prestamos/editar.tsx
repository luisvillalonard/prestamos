import AlertStatic from "@components/alerts/alert"
import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import { InputDatePicker } from "@components/inputs/date"
import InputNumbers from "@components/inputs/numbers"
import TitlePage from "@components/titles/titlePage"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { dateFormat, DateList, String_To_Date } from "@hooks/useDate"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatNumber } from "@hooks/useUtils"
import { Configuracion } from "@interfaces/configuraciones"
import { DateArray } from "@interfaces/globales"
import ClienteInfo from "@pages/clientes/info"
import { Col, Flex, Form, Input, Row, Select, Space, Switch, Tag, Typography } from "antd"
import { CSSProperties, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import PrestamoCuotas from "./cuotas"

const styleInputTotal: CSSProperties = {
    borderRadius: 0,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: Colors.Secondary
}

export default function FormPrestamoEditar() {

    const {
        contextClientes: { },
        contextPrestamos: { state: { modelo, procesando: cargandoPrestamo }, editar, actualizar, porId },
        contextPrestamosEstados: { todos: cargarEstados },
        contextFormasPago: { state: { datos: formasPago }, todos: cargarFormasPago },
        contextMetodosPago: { state: { datos: metodosPago }, todos: cargarMetodosPago },
        contextMonedas: { state: { datos: monedas }, todos: cargarMonedas },
        contextAcesores: { state: { datos: acesores }, todos: cargarAcesores },
    } = useData()
    const [configuracion] = useState<Configuracion | undefined>(undefined)
    const [errores, setErrores] = useState<string[]>([])
    const [fechasPago, setFechasPago] = useState<DateArray[]>([])
    const [isBlocked, setIsBlocked] = useState<boolean>(false)
    const [form] = Form.useForm()
    const nav = useNavigate()
    const url = useLocation()
    const { id } = useParams()

    const cargarAuxiliares = async () => await Promise.all([
        cargarFormasPago(),
        cargarMetodosPago(),
        cargarMonedas(),
        cargarAcesores(),
        cargarEstados()
    ])

    const cargarPrestamo = async (id: number) => {

        const result = await porId(id);
        if (!result) {
            setErrores(['Situación inesperada tratando de cargar el prestamo.']);
            return;
        }
        if (!result.ok) {
            setErrores([result.mensaje || 'Situación inesperada tratando de cargar el prestamo.']);
            return;
        }
        if (result.ok && !result.datos) {
            setErrores(['Código de préstamo no encontrado.']);
            return;
        }

        if (result.ok && result.datos) {
            const prest = result.datos;
            if (prest) {
                const totalIntereses = prest.monto * (prest.interes / 100);
                const capitalCuota = Number((prest.monto / prest.cuotas).toFixed(2));
                const interesCuota = Number(Number(totalIntereses / prest.cuotas).toFixed(2));
                form.setFieldsValue({
                    id: prest.id,
                    codigo: prest.codigo,
                    cliente: prest.cliente,
                    formaPagoId: prest.formaPago?.id,
                    formaPago: prest.formaPago,
                    metodoPagoId: prest.metodoPago?.id,
                    metodoPago: prest.metodoPago,
                    monedaId: prest.moneda?.id,
                    moneda: prest.moneda,
                    acesorId: prest.acesor?.id,
                    acesor: prest.acesor,
                    fechaRegistro: prest.fechaRegistro,
                    fechaCredito: prest.fechaCredito,
                    fechaInicioPago: prest.prestamoCuotas[0]?.fechaPago,
                    monto: prest.monto,
                    interes: prest.interes,
                    cuotas: prest.cuotas,
                    estado: prest.estado,
                    destino: prest.destino,
                    cancelado: prest.cancelado,
                    usuario: undefined,
                    prestamoCuotas: prest.prestamoCuotas,
                    reenganche: prest.reenganche,
                    aplicaDescuento: prest.aplicaDescuento,
                    totalInteres: totalIntereses,
                    capitalCuota: capitalCuota,
                    amortizacion: Number((capitalCuota + interesCuota).toFixed(2)),
                });
                setIsBlocked(prest.estado?.final === false);
                editar({
                    ...prest,
                    capitalCuota: capitalCuota,
                    totalInteres: totalIntereses,
                    amortizacion: Number((capitalCuota + interesCuota).toFixed(2)),
                });
                setFechasPago([{ fecha: prest.prestamoCuotas[0]?.fechaPago, anterior: false }]);

            } else {
                setErrores(['Código de préstamo no encontrado.']);
            }
        }

    }

    const calcularFechaPago = () => {

        if (!(modelo && modelo.fechaCredito && modelo.formaPago)) {
            setFechasPago([]);
            return;
        }

        const fechaInicio = String_To_Date(modelo.fechaCredito);
        if (!fechaInicio) return;

        const dias = modelo.formaPago.dias.map(item => item.dia);
        const fechas = DateList(fechaInicio, dias, dias.length);

        setFechasPago(fechas);
        editar({ ...modelo, fechaInicioPago: fechas.length > 0 ? fechas[0].fecha : undefined });

    }

    const validaPrestamo = () => {

        if (!modelo) return false;

        const alertas: string[] = [];

        if (!modelo.cliente || !modelo.cliente.id || modelo.cliente.id <= 0)
            alertas.push('Debe establecer el cliente del prestamo.');

        if (modelo.prestamoCuotas.length === 0)
            alertas.push('Debe calcular las cuotas del prestamo.');

        setErrores(alertas);
        return alertas.length === 0;
    }

    const guardar = async () => {

        if (!modelo) {
            Alerta('Debe completar los campos obligatorios del formulario antes de guardar.');
            return;
        }
        if (!validaPrestamo()) return;

        let resp;
        try {
            resp = await actualizar(modelo);
        } catch (error: any) {
            Alerta(error.message || 'Situación inesperada tratando de guardar los datos del prestamo.');
        }

        if (!resp) {
            editar(modelo);
            Alerta('Situación inesperada tratando de guardar los datos del prestamo.');
        } else if (!resp.ok) {
            editar(modelo);
            Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del prestamo.');
        } else {
            Exito(
                'Préstamo registrado exitosamente!',
                () => nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`, { replace: true })
            );
        }

    }

    useEffect(() => {
        cargarAuxiliares();
        if (id && !isNaN(parseInt(id))) {
            cargarPrestamo(Number(id));
        } else {
            setErrores(['El código de prestamo es inválido.'])
        }
    }, [url.pathname, id])
    useEffect(() => {
        if (modelo && modelo.fechaCredito && modelo.formaPago) {
            calcularFechaPago();
        }
    }, [modelo?.fechaCredito, modelo?.formaPago])

    if (!modelo) {
        return <Loading fullscreen active message="Cargando, espere" />
    }

    return (
        <>
            <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Formulario de C&aacute;lculo y Registro de Prestamo" />
                    <Space>
                        <ButtonPrimary size="large" htmlType="submit" form="FormPrestamo">
                            Actualizar
                        </ButtonPrimary>
                    </Space>
                </Flex>

                <AlertStatic errors={errores} />

                <Form
                    id="FormPrestamo"
                    name="FormPrestamo"
                    layout="vertical"
                    autoComplete="off"
                    size="large"
                    form={form}
                    onFinish={guardar}>

                    <Container
                        className="mb-3"
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Datos del Cliente</Typography.Title>}>
                        <ClienteInfo cliente={modelo.cliente} />
                    </Container>

                    <Container
                        className="mb-3"
                        title={
                            <Flex align="center" gap={10}>
                                <Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Datos del Prestamo</Typography.Title>
                                <Tag color='default' style={{ fontWeight: 500, fontSize: 16, borderRadius: 10, margin: 0 }}>{modelo?.codigo || 'P-000000'}</Tag>
                            </Flex>
                        }>
                        <Row gutter={[10, 10]}>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="monto" label="Monto" rules={[{ required: true, type: 'number', min: 1, message: 'Obligatorio' }]}>
                                    <InputNumbers
                                        name="monto"
                                        defaultValue={modelo.monto}
                                        value={modelo.monto}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    monto: Number(value),
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="interes" label="Interes (%)" rules={[{ required: true, type: 'number', min: 1, message: 'Obligatorio' }]}>
                                    <InputNumbers
                                        name="interes"
                                        defaultValue={modelo.interes}
                                        value={modelo.interes}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    interes: Number(value),
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="formaPagoId" label="Forma de Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        defaultValue={modelo.formaPagoId}
                                        value={modelo.formaPagoId}
                                        options={formasPago.map((item, index) => ({ key: index, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    formaPagoId: value,
                                                    formaPago: formasPago.filter(opt => opt.id === value)[0],
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="cuotas" label="N&uacute;mero Cuotas" rules={[{ required: true, type: 'number', min: 1, message: 'Obligatorio' }]}>
                                    <InputNumbers
                                        name="cuotas"
                                        defaultValue={modelo.cuotas}
                                        value={modelo.cuotas}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    cuotas: Number(value),
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="metodoPagoId" label="M&eacute;todo Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        defaultValue={modelo.metodoPagoId}
                                        value={modelo.metodoPagoId}
                                        options={metodosPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    metodoPagoId: value,
                                                    metodoPago: metodosPago.filter(opt => opt.id === value)[0],
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="monedaId" label="Tipo Moneda" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        defaultValue={modelo.monedaId}
                                        value={modelo.monedaId}
                                        options={monedas.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    monedaId: value,
                                                    moneda: monedas.filter(opt => opt.id === value)[0],
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="acesorId" label="Acesor">
                                    <Select
                                        defaultValue={modelo.acesorId}
                                        value={modelo.acesorId}
                                        options={acesores.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        notFoundContent={''}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    acesorId: value,
                                                    acesor: acesores.filter(opt => opt.id === value)[0],
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="fechaCredito" label="Fecha emisi&oacute;n" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputDatePicker
                                        name="fechaCredito"
                                        placeholder=""
                                        value={modelo.fechaCredito}
                                        minDate={configuracion && configuracion.permiteFechaAnteriorHoy ? undefined : new Date()}
                                        onChange={(date) => {
                                            if (modelo) {
                                                editar({ ...modelo, fechaCredito: !date ? '' : date.format(dateFormat) });
                                            }
                                        }}
                                        disabled={isBlocked} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="fechaInicioPago" label="Inicio de Pago" rules={[{ required: true, type: 'string', message: 'Obligatorio' }]}>
                                    <Select
                                        defaultActiveFirstOption={true}
                                        defaultValue={modelo.fechaInicioPago}
                                        value={modelo.fechaInicioPago}
                                        options={fechasPago.map((item, index) => {
                                            return { key: index, value: item.fecha, label: item.fecha }
                                        })}
                                        notFoundContent={''}
                                        disabled={isBlocked}
                                        onChange={(fecha) => {
                                            if (modelo) {
                                                editar({ ...modelo, fechaInicioPago: fecha });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Monto Cuota">
                                    <Input disabled variant="borderless" value={FormatNumber(modelo.capitalCuota, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Total Interes">
                                    <Input disabled variant="borderless" value={FormatNumber(modelo.totalInteres, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Monto a Pagar">
                                    <Input disabled variant="borderless" value={FormatNumber(modelo.amortizacion, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item>
                                    <Space>
                                        <Switch
                                            id="aplicaDescuento"
                                            checked={modelo.aplicaDescuento}
                                            disabled={isBlocked}
                                            onChange={(checked) => editar({ ...modelo, aplicaDescuento: checked })} />
                                        <span style={{ fontSize: 16 }}>Aplicar descuento extraordinario</span>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Container>

                    <Container
                        className="mb-3"
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Informaci&oacute;n de Cr&eacute;dito</Typography.Title>}>
                        <PrestamoCuotas
                            editando
                            cuotas={modelo?.prestamoCuotas ?? []}
                            aplicaDescuento={modelo.aplicaDescuento}
                            onChange={(cuotas) => {
                                if (modelo) {
                                    editar({ ...modelo, prestamoCuotas: cuotas })
                                }
                            }} />
                    </Container>

                </Form>
            </Col>
            <Loading active={cargandoPrestamo} message="Procesando, espere..." />
        </>
    )
}
