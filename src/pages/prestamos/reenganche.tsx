import AlertStatic from "@components/alerts/alert"
import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import InputNumbers from "@components/inputs/numbers"
import TitlePage from "@components/titles/titlePage"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { DateList, String_To_Date } from "@hooks/useDate"
import { IconCalculator } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatNumber } from "@hooks/useUtils"
import { DateArray } from "@interfaces/globales"
import { Prestamo, PrestamoCuota } from "@interfaces/prestamos"
import ClienteInfo from "@pages/clientes/info"
import { Col, Flex, Form, Input, Row, Select, Space, Tag, Typography } from "antd"
import { CSSProperties, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import PrestamoInfo from "./componentes/info"
import PrestamoCuotas from "./cuotas"

const styleInputTotal: CSSProperties = {
    borderRadius: 0,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: Colors.Secondary,
}

export default function FormPrestamoReenganche() {

    const {
        contextPrestamos: { state: { procesando: cargandoPrestamo }, agregar, porId },
        contextPrestamosEstados: { todos: cargarEstados },
        contextFormasPago: { todos: cargarFormasPago },
        contextMetodosPago: { todos: cargarMetodosPago },
        contextMonedas: { todos: cargarMonedas },
        contextAcesores: { todos: cargarAcesores },
    } = useData()
    const [prestamo, setPrestamo] = useState<Prestamo | undefined>(undefined)
    const [reenganche, setReenganche] = useState<Prestamo | undefined>(undefined)
    const [errores, setErrores] = useState<string[]>([])
    const [fechasPago, setFechasPago] = useState<DateArray[]>([])
    const [form] = Form.useForm()
    const nav = useNavigate()
    const url = useLocation()
    const { id } = useParams()

    const cargarAuxiliares = async () => await Promise.all([
        cargarFormasPago(),
        cargarMetodosPago(),
        cargarMonedas(),
        cargarAcesores(),
        cargarEstados(),
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
                setReenganche({
                    ...prest,
                    id: 0,
                    codigo: '',
                    formaPagoId: prest.formaPago?.id,
                    metodoPagoId: prest.metodoPago?.id,
                    monedaId: prest.moneda?.id,
                    acesorId: prest.acesor?.id,
                    usuario: undefined,
                    reenganche: true,
                    totalInteres: 0,
                    capitalCuota: 0,
                    amortizacion: 0,
                });
                setPrestamo(prest);

            } else {
                setErrores(['Código de préstamo no encontrado']);
            }
        }

    }

    const montoPendiente = (prestamo: Prestamo): number => {

        const { monto, prestamoCuotas } = prestamo
        if (!prestamoCuotas || prestamoCuotas.length === 0) return monto;

        const cuotasPendientes = prestamoCuotas.filter(cuota => !cuota.pagado)

        const total = cuotasPendientes.reduce((acc, item) => {
            const montoPagos: number = item.pagos && item.pagos.reduce((accP, itemP) => { return accP + itemP.monto }, 0);
            return acc - montoPagos;
        }, monto)

        return Math.round(total)
    }

    const calcularFechaPago = () => {

        if (!(reenganche && reenganche.fechaCredito && reenganche.formaPago)) {
            setFechasPago([]);
            return;
        }

        const fechaInicio = String_To_Date(reenganche.fechaCredito);
        if (!fechaInicio) return;

        const dias = reenganche.formaPago.dias.map(item => item.dia);
        const fechas = DateList(fechaInicio, dias, dias.length);

        setFechasPago(fechas);
        setReenganche({ ...reenganche, fechaInicioPago: fechas.length > 0 ? fechas[0].fecha : undefined });

    }

    const calcularCuotas = () => {

        if (!reenganche) {
            return;
        } else if (!prestamo) {
            return;
        }

        if (reenganche.monto > 0 && reenganche.interes >= 0 && reenganche.cuotas > 0 && reenganche.fechaInicioPago) {

            setErrores([]);

            const pendiente: number = montoPendiente(prestamo);
            const monto: number = reenganche.monto + pendiente;
            const interes: number = reenganche.interes;
            const cuotas: number = reenganche.cuotas;
            const fechaInicioPago: string = reenganche.fechaInicioPago;

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
                    amortizacion: Number((capitalCuota + interesCuota).toFixed(2)),
                    saldoFinal: saldoFinal < 0 ? 0 : saldoFinal,
                    vencido: fechas[index].anterior,
                } as PrestamoCuota

            });

            setReenganche({
                ...reenganche,
                capitalCuota: capitalCuota,
                totalInteres: totalIntereses,
                amortizacion: 0,
                prestamoCuotas: prestamoCuotas,
            });

        }

    }

    const validaPrestamo = () => {

        if (!reenganche) return false;

        const alertas: string[] = [];

        if (!reenganche.cliente || !reenganche.cliente.id || reenganche.cliente.id <= 0)
            alertas.push('Debe establecer el cliente del prestamo.');

        if (reenganche.prestamoCuotas.length === 0)
            alertas.push('Debe calcular las cuotas del prestamo.');

        setErrores(alertas);
        return alertas.length === 0;
    }

    const guardar = async () => {

        if (!reenganche) {
            Alerta('Debe completar los campos obligatorios del formulario antes de guardar.');
            return;
        }
        if (!validaPrestamo()) return;

        let resp;
        try {
            const pendiente: number = montoPendiente(prestamo!);
            resp = await agregar({ ...reenganche, monto: reenganche.monto + pendiente });
        } catch (error: any) {
            Alerta(error.message || 'Situación inesperada tratando de guardar los datos del prestamo.');
        }

        if (!resp) {
            setReenganche(reenganche);
            Alerta('Situación inesperada tratando de guardar los datos del prestamo.');
        } else if (!resp.ok) {
            setReenganche(reenganche);
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
        if (reenganche && reenganche.fechaCredito && reenganche.formaPago) {
            calcularFechaPago();
        }
    }, [reenganche?.fechaCredito, reenganche?.formaPago])

    if (!reenganche) {
        return <Loading fullscreen active message="Cargando, espere..." />
    } else if (!prestamo) {
        return <Loading fullscreen active message="Cargando, espere..." />
    }

    return (
        <>
            <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Formulario de C&aacute;lculo y Registro de Prestamo" />
                    <Space>
                        <ButtonPrimary key="2" id="btnGuardarReenganche" size="large" htmlType="submit" form="FormPrestamo">
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
                        className="mb-3">
                        <ClienteInfo cliente={reenganche.cliente} />
                    </Container>

                    <Container
                        className="mb-3"
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Datos del Reenganche</Typography.Title>}>
                        <Row gutter={[10, 10]} style={{ marginBottom: 10 }}>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="monto" label="Monto" rules={[{ required: true, type: 'number', min: 1, message: 'Obligatorio' }]}>
                                    <InputNumbers
                                        name="monto"
                                        defaultValue={reenganche.monto}
                                        value={reenganche.monto}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setReenganche({
                                                    ...reenganche,
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
                                        defaultValue={reenganche.interes}
                                        value={reenganche.interes}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (prestamo) {
                                                setReenganche({
                                                    ...reenganche,
                                                    interes: Number(value),
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="reengancheCuotas" label="N&uacute;mero Cuotas" rules={[{ required: true, type: 'number', min: 1, message: 'Obligatorio' }]}>
                                    <InputNumbers
                                        name="reengancheCuotas"
                                        defaultValue={reenganche.cuotas}
                                        value={reenganche.cuotas}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                        onFocus={(evt) => evt && evt.currentTarget && evt.currentTarget.select()}
                                        onChange={(value) => {
                                            if (reenganche) {
                                                setReenganche({
                                                    ...reenganche,
                                                    cuotas: Number(value),
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item name="reengancheFechaInicioPago" label="Inicio de Pago" rules={[{ required: true, type: 'string', message: 'Obligatorio' }]}>
                                    <Select
                                        defaultActiveFirstOption={true}
                                        defaultValue={reenganche.fechaInicioPago}
                                        value={reenganche.fechaInicioPago}
                                        options={fechasPago.map((item, index) => {
                                            return { key: index, value: item.fecha, label: item.fecha }
                                        })}
                                        notFoundContent={''}
                                        onChange={(fecha) => {
                                            if (reenganche) {
                                                setReenganche({ ...reenganche, fechaInicioPago: fecha });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col style={{ alignSelf: 'end' }}>
                                <ButtonDefault key="1" icon={<IconCalculator />} onClick={calcularCuotas}>Calcular</ButtonDefault>
                            </Col>
                        </Row>
                        <Row gutter={[10, 10]}>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Monto Cuota">
                                    <Input disabled variant="borderless" value={FormatNumber(reenganche.capitalCuota, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Total Interes">
                                    <Input disabled variant="borderless" value={FormatNumber(reenganche.totalInteres, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={4} md={8} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                <Form.Item label="Monto a Pagar">
                                    <Input disabled variant="borderless" value={FormatNumber(reenganche.amortizacion, 2)} style={styleInputTotal} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Container>

                    <Container
                        className="mb-3"
                        title={
                            <Flex align="center" gap={10}>
                                <Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Datos del Prestamo</Typography.Title>
                                <Tag color='default' style={{ fontWeight: 500, fontSize: 16, borderRadius: 10, margin: 0 }}>{prestamo.codigo || 'P-000000'}</Tag>
                            </Flex>
                        }>
                        <PrestamoInfo prestamo={prestamo} />
                    </Container>

                    <Container
                        className="mb-3"
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Informaci&oacute;n de Cr&eacute;dito</Typography.Title>}
                        styles={{
                            body: {
                                padding: 0,
                                overflowX: 'auto',
                            }
                        }}>
                        <PrestamoCuotas
                            cuotas={reenganche.prestamoCuotas}
                            aplicaDescuento={reenganche.aplicaDescuento} />
                    </Container>

                </Form>
            </Col>
            <Loading active={cargandoPrestamo} message="Procesando, espere..." />
        </>
    )
}
