import AlertStatic from "@components/alerts/alert"
import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import { ButtonSuccess } from "@components/buttons/success"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import { InputDatePicker } from "@components/inputs/date"
import InputNumbers from "@components/inputs/numbers"
import Searcher from "@components/inputs/searcher"
import TitlePage from "@components/titles/titlePage"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { dateFormat, DateList, DD_MM_YYYY, String_To_Date } from "@hooks/useDate"
import { IconCalculator } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatNumber } from "@hooks/useUtils"
import { Cliente } from "@interfaces/clientes"
import { Configuracion } from "@interfaces/configuraciones"
import { DateArray } from "@interfaces/globales"
import { Prestamo, PrestamoCuota } from "@interfaces/prestamos"
import ClienteInfo from "@pages/clientes/info"
import ListadoClientes from "@pages/clientes/listado"
import { Col, Collapse, Flex, Form, Input, Row, Select, Space, Switch, Tag, Typography } from "antd"
import { CSSProperties, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
        contextConfiguracionesGenerales: { ultima: ultimaConfiguracion },
        contextClientes: { state: { procesando: cargandoClientes }, porId: obtenerClientePorId },
        contextPrestamos: { state: { procesando: cargandoPrestamo }, agregar, actual },
        contextPrestamosEstados: { todos: cargarEstados },
        contextFormasPago: { state: { datos: formasPago }, todos: cargarFormasPago },
        contextMetodosPago: { state: { datos: metodosPago }, todos: cargarMetodosPago },
        contextMonedas: { state: { datos: monedas }, todos: cargarMonedas },
        contextAcesores: { state: { datos: acesores }, todos: cargarAcesores },
    } = useData()
    const [prestamo, setPrestamo] = useState<Prestamo | undefined>(undefined)
    const [configuracion, setConfiguracion] = useState<Configuracion | undefined>(undefined)
    const [errores, setErrores] = useState<string[]>([])
    const [fechasPago, setFechasPago] = useState<DateArray[]>([])
    const [activeKey, setActiveKey] = useState<string>('')
    const [isBlocked, setIsBlocked] = useState<boolean>(false)
    const [filtroCliente, setFiltroCliente] = useState<string>('')
    const [form] = Form.useForm()
    const nav = useNavigate()
    const diaActual: string = DD_MM_YYYY(new Date())

    const cargarAuxiliares = async () => await Promise.all([
        ultimaConfiguracion(),
        cargarFormasPago(),
        cargarMetodosPago(),
        cargarMonedas(),
        cargarAcesores(),
        cargarEstados()
    ]).then((result) => {
        const config = result.shift()?.datos;
        setConfiguracion(config);
    })

    const nuevoPrestamo = () => {
        const nuevo: Prestamo = {
            id: 0,
            codigo: '',
            cliente: undefined,
            formaPago: undefined,
            metodoPago: undefined,
            moneda: undefined,
            acesor: undefined,
            fechaRegistro: diaActual,
            fechaCredito: diaActual,
            monto: 0,
            interes: 0,
            cuotas: 0,
            estado: undefined,
            destino: '',
            cancelado: false,
            usuario: undefined,
            prestamoCuotas: [],
            aplicaDescuento: false,
            totalInteres: 0,
            capitalCuota: 0,
            amortizacion: 0,
            reenganche: false,
        }
        setPrestamo(nuevo);
        setErrores([]);
        setFechasPago([]);
        setIsBlocked(false);
        setActiveKey('');
        setFormFieldsValues(nuevo);
    }

    const setFormFieldsValues = (item: Prestamo) => {
        const totalInteres = item.monto > 0 && item.interes > 0 ? item.monto * (item.interes / 100) : 0;
        const capitalCuota = item.monto > 0 && item.cuotas > 0 ? Number((item.monto / item.cuotas).toFixed(2)) : 0;
        const interesCuota = totalInteres > 0 && item.cuotas > 0 ? Number(Number(totalInteres / item.cuotas).toFixed(2)) : 0;
        form.setFieldsValue({
            id: item.id,
            codigo: item.codigo,
            cliente: item.cliente,
            formaPagoId: item.formaPago?.id,
            formaPago: item.formaPago,
            metodoPagoId: item.metodoPago?.id,
            metodoPago: item.metodoPago,
            monedaId: item.moneda?.id,
            moneda: item.moneda,
            acesorId: item.acesor?.id,
            acesor: item.acesor,
            fechaRegistro: item.fechaRegistro,
            fechaCredito: item.fechaCredito,
            fechaInicioPago: item.prestamoCuotas[0]?.fechaPago,
            monto: item.monto,
            interes: item.interes,
            cuotas: item.cuotas,
            estado: item.estado,
            destino: item.destino,
            cancelado: item.cancelado,
            usuario: undefined,
            itemamoCuotas: item.prestamoCuotas,
            aplicaDescuento: item.aplicaDescuento,
            totalInteres: totalInteres,
            capitalCuota: capitalCuota,
            amortizacion: Number((capitalCuota / interesCuota).toFixed(2)),
        });
    }

    const seleccionaCliente = async ({ id }: Cliente) => {

        setErrores([]);

        const resultPrestamo = await actual(id);
        if (resultPrestamo && resultPrestamo.ok && resultPrestamo.datos) {
            const prest = resultPrestamo.datos;
            if (prest) {
                const totalInteres = prest.monto * (prest.interes / 100);
                const capitalCuota = Number((prest.monto / prest.cuotas).toFixed(2));
                const interesCuota = Number(Number(totalInteres / prest.cuotas).toFixed(2));

                setPrestamo({
                    ...prest,
                    totalInteres: totalInteres,
                    capitalCuota: capitalCuota,
                    amortizacion: Number((capitalCuota + interesCuota).toFixed(2)),
                });
                setFormFieldsValues(prest);
                setErrores(['Este cliente tiene un préstamo activo. Debe hacer un reenganche para continuar con el prestamo.']);
                setIsBlocked(true);
                setActiveKey('');
                return;
            }
            return;
        }

        const resultCliente = await obtenerClientePorId(id);
        if (!resultCliente) {
            setErrores(['Situación inesperada tratando de cargar el cliente.']);
            return;
        }
        if (!resultCliente.ok) {
            setErrores([resultCliente.mensaje || 'Situación inesperada tratando de cargar el cliente.']);
            return;
        }
        if (resultCliente.ok && resultCliente.datos) {
            const cliente = resultCliente.datos;
            if (cliente && prestamo) {
                setPrestamo({ ...prestamo, cliente: cliente });
                setIsBlocked(false);
                setActiveKey('');
            } else {
                setErrores(['Código de cliente no encontrado.']);
            }
        }

    }

    const calcularFechaPago = () => {

        if (!(prestamo && prestamo.fechaCredito && prestamo.formaPago)) {
            setFechasPago([]);
            return;
        }

        const fechaInicio = String_To_Date(prestamo.fechaCredito);
        if (!fechaInicio) return;

        const dias = prestamo.formaPago.dias.map(item => item.dia);
        const fechas = DateList(fechaInicio, dias, dias.length);

        setFechasPago(fechas);
        setPrestamo({ ...prestamo, fechaInicioPago: fechas.length > 0 ? fechas[0].fecha : undefined });

    }

    const calcularCuotas = () => {

        if (!prestamo) return;

        if (prestamo.monto > 0 && prestamo.interes >= 0 && prestamo.cuotas > 0 && prestamo.fechaInicioPago) {

            setErrores([]);

            const monto: number = prestamo.monto;
            const interes: number = prestamo.interes;
            const cuotas: number = prestamo.cuotas;
            const fechaInicioPago: string = prestamo.fechaInicioPago;

            let saldoFinal: number = monto;
            const totalIntereses = monto * (interes / 100);
            const capitalCuota = Number((monto / cuotas).toFixed(2));

            const dias = prestamo.formaPago?.dias.map(item => item.dia) ?? [];
            const fechaInicio = String_To_Date(fechaInicioPago)!;
            const fechas = DateList(fechaInicio, dias, cuotas);
            const prestamoCuotas = Array.from(Array(cuotas).keys()).map((_num, index) => {

                const interesCuota = Number(Number(saldoFinal * (interes / 100)).toFixed(2))
                saldoFinal = Number((saldoFinal - capitalCuota).toFixed(2));

                return {
                    fechaPago: fechas[index].fecha,
                    deudaInicial: monto,
                    capital: capitalCuota,
                    interes: interesCuota,
                    descuento: 0,
                    amortizacion: Number((interesCuota + capitalCuota).toFixed(2)),
                    saldoFinal: saldoFinal < 0 ? 0 : saldoFinal,
                    vencido: fechas[index].anterior,
                } as PrestamoCuota

            });

            setPrestamo({
                ...prestamo,
                capitalCuota: capitalCuota,
                totalInteres: totalIntereses,
                amortizacion: 0,
                prestamoCuotas: prestamoCuotas,
            });

        }

    }

    const validaPrestamo = () => {

        if (!prestamo) return false;

        const alertas: string[] = [];

        if (!prestamo.cliente || !prestamo.cliente.id || prestamo.cliente.id <= 0)
            alertas.push('Debe establecer el cliente del prestamo.');

        if (prestamo.prestamoCuotas.length === 0)
            alertas.push('Debe calcular las cuotas del prestamo.');

        setErrores(alertas);
        return alertas.length === 0;
    }

    const guardar = async () => {

        if (!prestamo) {
            Alerta('Debe completar los campos obligatorios del formulario antes de guardar.');
            return;
        }
        if (!validaPrestamo()) return;

        let resp;
        try {
            resp = await agregar(prestamo);
        } catch (error: any) {
            Alerta(error.message || 'Situación inesperada tratando de guardar los datos del prestamo.');
        }

        if (!resp) {
            setPrestamo(prestamo);
            Alerta('Situación inesperada tratando de guardar los datos del prestamo.');
        } else if (!resp.ok) {
            setPrestamo(prestamo);
            Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del prestamo.');
        } else {
            Exito(
                'Préstamo registrado exitosamente!',
                () => nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`, { replace: true })
            );
        }

    }

    useEffect(() => { nuevoPrestamo(), cargarAuxiliares() }, [])
    useEffect(() => {
        if (prestamo && prestamo.fechaCredito && prestamo.formaPago) {
            calcularFechaPago();
        }
    }, [prestamo?.fechaCredito, prestamo?.formaPago])

    if (!prestamo) {
        return <Loading fullscreen active message="Cargando, espere" />
    }

    return (
        <>
            <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Formulario de C&aacute;lculo y Registro de Prestamo" />
                    <Space>
                        <ButtonDefault key="1" size="large" onClick={nuevoPrestamo}>Nuevo</ButtonDefault>
                        <ButtonPrimary key="2" id="btnGuardar" size="large" htmlType="submit" form="FormPrestamo" disabled={isBlocked}>
                            Guardar
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
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Datos del Cliente</Typography.Title>}
                        extra={
                            <Searcher disabled={prestamo.id > 0} onChange={(value) => {
                                setFiltroCliente(value);
                                setActiveKey(!value ? '' : '1');
                            }} />
                        }
                        className="mb-3"
                        styles={{ body: { position: 'relative' } }}>
                        <ClienteInfo cliente={prestamo.cliente} />
                        <Collapse
                            ghost
                            size="small"
                            bordered={false}
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
                                        <ListadoClientes
                                            soloActivos
                                            filter={filtroCliente}
                                            onClick={(cliente: Cliente) => { seleccionaCliente(cliente) }} />
                                    </>,
                                },
                            ]}
                        >
                        </Collapse>
                        <Loading active={cargandoClientes} message="buscando, espere" />
                    </Container>

                    <Container
                        className="mb-3"
                        title={
                            <Flex align="center" gap={10}>
                                <Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Datos del Prestamo</Typography.Title>
                                <Tag color='default' style={{ fontWeight: 500, fontSize: 16, borderRadius: 10, margin: 0 }}>{prestamo?.codigo || 'P-000000'}</Tag>
                            </Flex>
                        }
                        extra={
                            <Flex gap={10}>
                                {
                                    isBlocked
                                        ?
                                        <ButtonSuccess onClick={() => {
                                            nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Reenganche.replace(':id?', prestamo.id.toString())}`, { replace: true })
                                        }}>
                                            Reenganchar
                                        </ButtonSuccess>
                                        : <></>
                                }
                                <ButtonPrimary icon={<IconCalculator />} onClick={calcularCuotas} disabled={isBlocked}>Calcular</ButtonPrimary>
                            </Flex>
                        }>
                        <Row gutter={[10, 10]}>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="monto" label="Monto" rules={[{ required: true, type: 'number', min: 1, message: 'Obligatorio' }]}>
                                    <InputNumbers
                                        name="monto"
                                        defaultValue={prestamo.monto}
                                        value={prestamo.monto}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setPrestamo({
                                                    ...prestamo,
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
                                        defaultValue={prestamo.interes}
                                        value={prestamo.interes}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setPrestamo({
                                                    ...prestamo,
                                                    interes: Number(value),
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="formaPagoId" label="Forma de Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        defaultValue={prestamo.formaPagoId}
                                        value={prestamo.formaPagoId}
                                        options={formasPago.map((item, index) => ({ key: index, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setPrestamo({
                                                    ...prestamo,
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
                                        defaultValue={prestamo.cuotas}
                                        value={prestamo.cuotas}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        disabled={isBlocked}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setPrestamo({
                                                    ...prestamo,
                                                    cuotas: Number(value),
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="metodoPagoId" label="M&eacute;todo Pago" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        defaultValue={prestamo.metodoPagoId}
                                        value={prestamo.metodoPagoId}
                                        options={metodosPago.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setPrestamo({
                                                    ...prestamo,
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
                                        defaultValue={prestamo.monedaId}
                                        value={prestamo.monedaId}
                                        options={monedas.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setPrestamo({
                                                    ...prestamo,
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
                                        defaultValue={prestamo.acesorId}
                                        value={prestamo.acesorId}
                                        options={acesores.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        disabled={isBlocked}
                                        notFoundContent={''}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setPrestamo({
                                                    ...prestamo,
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
                                        value={prestamo.fechaCredito}
                                        minDate={configuracion && configuracion.permiteFechaAnteriorHoy ? undefined : new Date()}
                                        onChange={(date) => {
                                            if (prestamo) {
                                                setPrestamo({ ...prestamo, fechaCredito: !date ? '' : date.format(dateFormat) });
                                            }
                                        }}
                                        disabled={isBlocked} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="fechaInicioPago" label="Inicio de Pago" rules={[{ required: true, type: 'string', message: 'Obligatorio' }]}>
                                    <Select
                                        defaultActiveFirstOption={true}
                                        defaultValue={prestamo.fechaInicioPago}
                                        value={prestamo.fechaInicioPago}
                                        options={fechasPago.map((item, index) => {
                                            return { key: index, value: item.fecha, label: item.fecha }
                                        })}
                                        notFoundContent={''}
                                        disabled={isBlocked}
                                        onChange={(fecha) => {
                                            if (prestamo) {
                                                setPrestamo({ ...prestamo, fechaInicioPago: fecha });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Monto Cuota">
                                    <Input disabled variant="borderless" value={FormatNumber(prestamo.capitalCuota, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Total Interes">
                                    <Input disabled variant="borderless" value={FormatNumber(prestamo.totalInteres, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Monto a Pagar">
                                    <Input disabled variant="borderless" value={FormatNumber(prestamo.amortizacion, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            {
                                prestamo.id > 0
                                    ? <></>
                                    :
                                    <Col xs={24} style={{ alignSelf: 'end' }}>
                                        <Form.Item>
                                            <Space>
                                                <Switch
                                                    id="aplicaDescuento"
                                                    checked={prestamo.aplicaDescuento}
                                                    onChange={(checked) => setPrestamo({ ...prestamo, aplicaDescuento: checked })} />
                                                <span style={{ fontSize: 16 }}>Aplicar descuento extraordinario</span>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                            }
                        </Row>
                    </Container>

                    <Container
                        className="mb-3"
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Informaci&oacute;n de Cr&eacute;dito</Typography.Title>}>
                        <PrestamoCuotas
                            editando
                            cuotas={prestamo?.prestamoCuotas}
                            aplicaDescuento={prestamo.aplicaDescuento}
                            onChange={(cuotas: PrestamoCuota[]) => {
                                if (prestamo) {
                                    setPrestamo({ ...prestamo, prestamoCuotas: cuotas })
                                }
                            }} />
                    </Container>

                </Form>
            </Col>
            <Loading active={cargandoPrestamo} message="Procesando, espere..." />
        </>
    )
}
