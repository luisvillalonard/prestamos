import { ButtonPrimary } from "@components/buttons/primary"
import FormItem from "@components/forms/item"
import InputDate from "@components/inputs/date"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { IconSearch, useIconos } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatDate_DDMMYYYY, FormatNumber } from "@hooks/useUtils"
import { Cliente } from "@interfaces/clientes"
import { Prestamo, PrestamoCuota } from "@interfaces/prestamos"
import { Alert, Button, Col, Divider, Flex, Form, Input, InputNumber, InputRef, List, message, Row, Select, Space, Tag, theme, Typography } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PrestamoCuotas from "./cuotas"

export default function FormPrestamo() {

    const {
        contextClientes: { porCodigo },
        contextPrestamos: { state: { modelo }, nuevo, agregar },
        contextPrestamosEstados: { state: { datos: estados }, todos: cargarEstados },
        contextFormasPago: { state: { datos: formasPago }, todos: cargarFormasPago },
        contextMetodosPago: { state: { datos: metodosPago }, todos: cargarMetodosPago },
        contextMonedas: { state: { datos: monedas }, todos: cargarMonedas },
        contextAcesores: { state: { datos: acesores }, todos: cargarAcesores },
    } = useData()
    const { entidad, editar } = useForm<Prestamo | undefined>(modelo)
    const [errores, setErrores] = useState<string[]>([])
    const [messageApi, contextHolder] = message.useMessage()
    const searchRef = useRef<InputRef>(null)
    const { IconCalculator } = useIconos()
    const { token } = theme.useToken()
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

        if (!entidad) return;

        if (!entidad.cliente || !entidad.cliente.documento) {
            messageApi.open({
                duration: 3,
                type: 'warning',
                content: 'Debe indicar el documento del cliente.',
            });
            if (searchRef && searchRef.current) {
                searchRef.current.focus()
            }
            return;
        }

        const result = await porCodigo(entidad?.cliente?.documento);
        if (result) {
            if (!result.ok) {
                mensajeBusquedaCliente(result.mensaje || 'No fue posible obtener el cliente con el documento establecido.');
                return;
            }
            editar({
                ...entidad,
                cliente: result.datos
            })
        }
    }

    const mensajeBusquedaCliente = (mensaje: string) => {

        messageApi.open({
            duration: 3,
            type: 'warning',
            content: mensaje || 'No fue posible obtener el cliente con el documento establecido',
        });
    };

    const calcularCuotas = () => {

        if (!entidad) return;

        if (entidad.deudaInicial && entidad.interes && entidad.cantidadCuotas) {

            const porcientoInteres = (entidad.interes / 100);
            const totalIntereses = entidad.deudaInicial * porcientoInteres;
            const interesCuota = Number(Number(totalIntereses / entidad.cantidadCuotas).toFixed(2))
            const capitalCuota = Number((entidad.deudaInicial / entidad.cantidadCuotas).toFixed(2))
            let saldoFinal: number = entidad.deudaInicial;

            const cuotas = Array.from(Array(entidad.cantidadCuotas).keys()).map(() => {

                saldoFinal = Number((saldoFinal - capitalCuota).toFixed(2));
                return {
                    fechaPago: entidad.fechaCredito,
                    deudaInicial: entidad.deudaInicial,
                    capital: capitalCuota,
                    interes: interesCuota, // dividir aqui entre las formas de pago
                    amortizacion: Number((interesCuota + capitalCuota).toFixed(2)),
                    saldoFinal,
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

        if (!entidad.cliente) alertas.push('Debe establecer el cliente del prestamo.');
        if (entidad.cuotas.length === 0) alertas.push('Debe calcular las cuotas del prestamo.');

        setErrores(alertas);
        return alertas.length === 0;
    }

    const guardar = async () => {

        //console.log('prestamo', entidad)
        if (entidad) {

            if (!validaPrestamo()) return;

            let estado;
            const esNuevo = entidad.id === 0;
            if (esNuevo) {
                estado = estados.filter(est => est.inicial).shift();
                if (!estado) {
                    Alerta('Estado inicial no encontrado. Debe configurarse en Data Maestra un estado de prestamo como inicial.');
                    return;
                }
            }

            let resp;
            try {
                resp = await agregar({ ...entidad, estado: estado, fechaRegistro: FormatDate_DDMMYYYY(new Date().toISOString().substring(0, 10))! });
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
                    `Préstamo ${esNuevo ? 'registrado' : 'actualizado'}  exitosamente!`,
                    () => nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`)
                );
            }

        }

    }

    useEffect(() => { cargarAuxiliares() }, [])
    useEffect(() => {
        if (!codigo || !Number(codigo)) {
            nuevo()
        }
    }, [codigo])
    useEffect(() => { editar(modelo) }, [modelo])
    useEffect(() => { searchRef && searchRef.current && searchRef.current.focus() }, [searchRef])

    return (
        <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

            <Flex align="center" justify="space-between">
                <Typography.Title level={3} style={{ fontWeight: 'bolder', marginBottom: 0, color: token.colorPrimary }}>
                    Formulario de C&aacute;lculo y Registro de Prestamo
                </Typography.Title>
                <ButtonPrimary size="large" htmlType="submit" form="FormPrestamo">
                    {entidad && entidad.id > 0 ? 'Actualizar' : 'Guardar'}
                </ButtonPrimary>
            </Flex>
            <Divider className='my-3' />

            {
                errores.length === 0
                    ? <></>
                    :
                    <Alert
                        type="error"
                        closable={false}
                        showIcon
                        description={errores.length === 0 ? <></> : <ul className="m-0 ps-3">{errores.map(err => <li>{err}</li>)}</ul>}
                        message={<h1 className="fs-5" style={{ color: Colors.Danger }}>Alerta</h1>}
                        className="mb-3"
                        style={{ borderLeftWidth: 6, borderLeftColor: Colors.Danger }}
                    />
            }

            <Form
                name="FormPrestamo"
                layout="vertical"
                autoComplete="off"
                size="large"
                disabled={false}
                initialValues={{
                    ...modelo,
                    formaPagoId: modelo?.formaPago?.id,
                    metodoPagoId: modelo?.metodoPago?.id,
                    monedaId: modelo?.moneda?.id,
                    acesorId: modelo?.acesor?.id,
                }}
                onFinish={guardar}>

                <Row gutter={[20, 30]}>

                    <Col lg={8} md={8} sm={24} xs={24}>
                        <Typography.Title level={4} style={{ fontWeight: 'bolder' }}>Datos del Cliente</Typography.Title>
                        <Divider className="my-1 mb-2" />

                        <Flex vertical style={{ position: 'relative' }}>
                            {contextHolder}
                            <label style={{ marginBottom: 6 }}>
                                {`Documento ${entidad?.cliente?.documentoTipo?.nombre || ''}`.trim()}
                            </label>
                            <Space.Compact>
                                <Input
                                    ref={searchRef}
                                    value={entidad?.cliente?.documento || ''}
                                    onChange={(evt) => {
                                        if (entidad) {
                                            editar({ ...entidad, cliente: { ...entidad.cliente, documento: evt.target.value } as Cliente })
                                        }
                                    }} />
                                <Button icon={<IconSearch />} onClick={buscarCliente} />
                            </Space.Compact>
                        </Flex>
                        <List size="small">
                            <List.Item>
                                <List.Item.Meta
                                    title="Nombres y Apellidos"
                                    description={`${entidad?.cliente?.nombres || ''} ${entidad?.cliente?.apellidos || ''}`.trim() || 'Desconocido'} />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta title="C&oacute;digo Empleado" description={entidad?.cliente?.empleadoId || 'Desconocido'} />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta title="Tel&eacute;fono Celular" description={entidad?.cliente?.telefonoCelular || 'Desconocido'} />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta title="Ocupaci&oacute;n" description={entidad?.cliente?.ocupacion?.nombre || 'Desconocido'} />
                            </List.Item>
                        </List>
                    </Col>

                    <Col lg={16} md={16} sm={24} xs={24}>
                        <Flex align="center" justify="space-between">
                            <Typography.Title level={4} style={{ fontWeight: 'bolder' }}>Datos del Prestamo</Typography.Title>
                            <Space>
                                <Typography.Title level={5} style={{ fontWeight: 'bolder', margin: 0 }}>C&oacute;digo</Typography.Title>
                                <Tag color='blue' style={{ fontWeight: 'bolder', fontSize: 16, borderRadius: 10 }}>{entidad?.codigo || 'P-000000'}</Tag>
                            </Space>
                        </Flex>
                        <Divider className="my-1 mb-2" />

                        <Row gutter={[10, 10]}>
                            <Col xl={6} lg={6} md={8} sm={24} xs={24}>
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
                            <Col xl={6} lg={6} md={8} sm={24} xs={24}>
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
                            <Col xl={6} lg={6} md={8} sm={24} xs={24}>
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
                            <Col xl={6} lg={6} md={8} sm={24} xs={24}>
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
                            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
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
                            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
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
                            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                                <FormItem name="fechaCredito" label="Fecha emisi&oacute;n" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <InputDate
                                        name="fechaCredito"
                                        placeholder=""
                                        value={entidad?.fechaCredito}
                                        onChange={(date) => {
                                            if (entidad) {
                                                editar({ ...entidad, fechaCredito: date.format('DD-MM-YYYY') })
                                            }
                                        }} />
                                </FormItem>
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
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
                            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                                <FormItem label="Monto Cuota">
                                    <Input disabled value={FormatNumber(!entidad || !entidad.deudaInicial || !entidad.cantidadCuotas ? 0 : (entidad.deudaInicial / entidad.cantidadCuotas), 2)} />
                                </FormItem>
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                                <FormItem label="Total Interes">
                                    <Input disabled value={FormatNumber(!entidad || !entidad.deudaInicial || !entidad.interes ? 0 : (entidad.deudaInicial * (entidad.interes / 100)), 2)} />
                                </FormItem>
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                                <FormItem label="Monto a Pagar">
                                    <Input disabled value={FormatNumber(0, 2)} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={24}>
                        <Flex align="center" justify="space-between">
                            <Typography.Title level={4} style={{ fontWeight: 'bolder' }}>Informaci&oacute;n de Cr&eacute;dito</Typography.Title>
                            <ButtonPrimary size="middle" icon={<IconCalculator />} onClick={calcularCuotas}>Calcular</ButtonPrimary>
                        </Flex>
                        <Divider className="my-1 mb-2" />
                        <PrestamoCuotas cuotas={entidad?.cuotas ?? []} />
                    </Col>
                </Row>

            </Form>
        </Col>
    )
}