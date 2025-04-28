import AlertStatic from "@components/alerts/alert"
import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import TitlePage from "@components/titles/titlePage"
import TitlePanel from "@components/titles/titlePanel"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { IconListPoint, IconSearch } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Prestamo, PrestamoPago } from "@interfaces/prestamos"
import ClienteInfo from "@pages/clientes/info"
import { Col, Divider, Flex, Form, InputNumber, Row, Tabs, Tag } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import BuscadorPrestamo from "../busqueda"
import PrestamoCuotas from "../cuotas"
import PrestamoInfo from "../componentes/info"

enum ActiveKeyEnum {
    Busqueda = '1',
    Formulario = '2',
}

export default function PagePrestamoCobro() {

    const {
        contextPrestamos: { state: { procesando: cargandoPrestamo }, porId },
        contextPrestamosPagos: { state: { modelo, procesando }, nuevo, editar: modificar, agregar },
    } = useData()
    const { entidad, editar } = useForm<PrestamoPago | undefined>(modelo)
    const [prestamo, setPrestamo] = useState<Prestamo | undefined>(undefined)
    const [errores, setErrores] = useState<string[]>([])
    const [activeKey, setActiveKey] = useState<string>("1")
    const { id } = useParams()
    const nav = useNavigate()
    const url = useLocation()

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
                    usuario: undefined
                });
                setActiveKey("2");

            } else {

                setErrores(['Código de prestamo no encontrado']);

            }
        }

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

                <Container className="mb-3">
                    <Tabs
                        size="large"
                        items={[
                            {
                                key: "1",
                                label: (
                                    <Flex align="center" gap={10}>
                                        <IconSearch style={{ color: activeKey === ActiveKeyEnum.Busqueda ? Colors.Primary : 'inherit' }} />
                                        <span>Buscar Préstamo</span>
                                    </Flex>
                                )
                            }, {
                                key: "2",
                                label: (
                                    <Flex align="center" gap={10}>
                                        <IconListPoint style={{ fontSize: 18, color: activeKey === ActiveKeyEnum.Formulario ? Colors.Primary : 'inherit' }} />
                                        <span>Formulario de Pago</span>
                                    </Flex>
                                ),
                                disabled: !prestamo
                            }
                        ]}
                        defaultActiveKey=""
                        activeKey={activeKey}
                        onChange={setActiveKey} />
                </Container>

                {
                    activeKey === ActiveKeyEnum.Busqueda
                        ? <Container>
                            <BuscadorPrestamo onChange={(value: Prestamo) => {
                                setPrestamo(value);
                                if (entidad) {
                                    editar({
                                        ...entidad,
                                        prestamoId: value.id,
                                        metodoPago: value.metodoPago,
                                    });
                                    setActiveKey("2");
                                }
                            }} />
                        </Container>
                        : <Flex vertical gap={20}>
                            <Container
                                size="small"
                                title={<TitlePanel title="Datos del Pago" color={Colors.Primary} />}>
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
                            </Container>

                            <Container
                                size="small"
                                title={<TitlePanel title="Datos del Cliente" color={Colors.Primary} />}>
                                <ClienteInfo cliente={prestamo?.cliente} />
                            </Container>

                            <Container
                                size="small"
                                title={
                                    <Flex align="center" gap={10}>
                                        <TitlePanel title="Datos del Prestamo" color={Colors.Primary} />
                                        <Tag color='blue' style={{ fontSize: 16, borderRadius: 10 }}>{prestamo?.codigo || 'P-000000'}</Tag>
                                    </Flex>
                                }>
                                <PrestamoInfo prestamo={prestamo} />
                            </Container>

                            <Container
                                size="small"
                                title={<TitlePanel title="Informaci&oacute;n de Cr&eacute;dito" color={Colors.Primary} />}
                                styles={{
                                    body: {
                                        padding: 0,
                                        overflow: 'auto',
                                    }
                                }}>
                                <PrestamoCuotas
                                    cuotas={prestamo?.prestamoCuotas ?? []}
                                    aplicaDescuento={prestamo?.aplicaDescuento ?? false} />
                            </Container>
                        </Flex>

                }
            </Col>
            <Loading
                fullscreen
                active={procesando || cargandoPrestamo}
                message={
                    procesando
                        ? 'Procesando, espere...'
                        : cargandoPrestamo
                            ? 'Buscando prestamo, espere...'
                            : ''
                } />
        </>
    )
}
