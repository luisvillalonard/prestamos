import AlertStatic from "@components/alerts/alert"
import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import { InputDatePicker } from "@components/inputs/date"
import TitlePage from "@components/titles/titlePage"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { dateFormat } from "@hooks/useDate"
import { IconCheckCircleColor } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Col, Flex, Form, Input, Radio, RadioChangeEvent, Row, Select, Space, Switch, Tag, Typography } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function FormCliente() {

    const {
        contextClientes: { state: { modelo, procesando }, nuevo, editar, agregar, actualizar, porId },
        contextDocumentosTipos: { state: { datos: documentosTipos }, todos: cargarDocumentosTipos },
        contextSexos: { state: { datos: sexos }, todos: cargarSexos },
        contextCiudades: { state: { datos: ciudades }, todos: cargarCiudades },
        contextOcupaciones: { state: { datos: ocupaciones }, todos: cargarOcupaciones },
        contextAuth: { state: { user } },
    } = useData()
    /* const { entidad, editar } = useForm<Cliente | undefined>(undefined) */
    const [errores, setErrores] = useState<string[]>([])
    const [form] = Form.useForm()
    const nav = useNavigate()
    const url = useLocation()
    const { id } = useParams()

    const cargarAuxiliares = async () => await Promise.all([cargarDocumentosTipos(), cargarSexos(), cargarCiudades(), cargarOcupaciones()])

    const cargarCliente = async (id: number) => {

        const result = await porId(id);
        if (!result) {
            setErrores(['Situación inesperada tratando de cargar el cliente.']);
            return;
        }
        if (!result.ok) {
            setErrores([result.mensaje || 'Situación inesperada tratando de cargar el cliente.']);
            return;
        }
        if (result.ok && !result.datos) {
            setErrores(['Código de cliente no encontrado.']);
            return;
        }

        if (result.ok && result.datos) {
            const cliente = result.datos;
            if (cliente) {
                editar({
                    ...cliente,
                    documentoTipoId: cliente.documentoTipo?.id,
                    sexoId: cliente.sexo?.id,
                    ciudadId: cliente.ciudad?.id,
                    ocupacionId: cliente.ocupacion?.id,
                });
            } else {
                setErrores(['Código de cliente no encontrado.']);
            }
        }

    }

    const guardar = async () => {

        if (modelo) {

            let resp;
            const esNuevo = modelo.id === 0;

            try {
                if (esNuevo) {
                    resp = await agregar(modelo);
                } else {
                    resp = await actualizar(modelo);
                }
            } catch (error: any) {
                Alerta(error.message || 'Situación inesperada tratando de guardar los datos del cliente.');
            }

            if (!resp) {
                editar(modelo);
                Alerta('Situación inesperada tratando de guardar los datos del cliente.');

            } else if (!resp.ok) {
                editar(modelo);
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del cliente.');

            } else {
                if (resp.datos) {
                    editar(resp.datos)
                }
                Exito(
                    `Cliente ${esNuevo ? 'registrado' : 'actualizado'}  exitosamente!`,
                    () => { nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Registrados}`, { replace: true }) }
                );
            }
        }
    }

    useEffect(() => {
        cargarAuxiliares();
        if (!id || !Number(id)) {
            nuevo();
        } else {
            cargarCliente(Number(id));
        }
    }, [url.pathname, id])
    useEffect(() => {
        if (modelo) {
            form.setFieldsValue({
                nombres: modelo.nombres,
                apellidos: modelo.apellidos,
                empleadoId: modelo.empleadoId,
                documentoTipoId: modelo.documentoTipoId,
                documento: modelo.documento,
                fechaNacimiento: modelo.fechaNacimiento ? modelo.fechaNacimiento : undefined,
                sexoId: modelo.sexoId,
                ciudadId: modelo.ciudadId,
                ocupacionId: modelo.ocupacionId,
                direccion: modelo.direccion,
                telefonoCelular: modelo.telefonoCelular,
                telefonoFijo: modelo.telefonoFijo,
                fechaAntiguedad: modelo.fechaAntiguedad ? modelo.fechaAntiguedad : undefined
            });
        }
    }, [modelo])

    if (!modelo) {
        return <Loading fullscreen active message="Cargando, espere..." />
    }

    return (
        <>
            <Col span={18} offset={3}>

                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Formulario de Cliente" />
                    <Space>
                        <ButtonPrimary size="large" htmlType="submit" form="FormCliente">
                            {modelo && modelo.id > 0 ? 'Actualizar' : 'Guardar'}
                        </ButtonPrimary>
                    </Space>
                </Flex>

                <AlertStatic errors={errores} />

                <Form
                    name="FormCliente"
                    layout="vertical"
                    autoComplete="off"
                    size="large"
                    form={form}
                    onFinish={guardar}>

                    <Container className="mb-4"
                        title={
                            <Flex align="center" gap={10}>
                                <Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Generales</Typography.Title>
                                {
                                    user && user.rol && user.rol.esAdmin
                                        ? <></>
                                        : modelo?.activo === true
                                            ? <Tag color='green' style={{ fontSize: 16, borderRadius: 10 }}>Activo</Tag>
                                            : <Tag color='error' style={{ fontSize: 16, borderRadius: 10 }}>Inactivo</Tag>
                                }
                            </Flex>
                        }
                        extra={
                            <Flex align="center" gap={10}>
                                <Typography.Title level={4} style={{ fontWeight: 'bolder', margin: 0 }}>C&oacute;digo</Typography.Title>
                                {
                                    !modelo?.codigo
                                        ? <Tag style={{ fontSize: 16, borderRadius: 10 }}>C-00000</Tag>
                                        : <Tag color='blue' style={{ fontSize: 16, borderRadius: 10 }}>{modelo.codigo}</Tag>
                                }
                            </Flex>
                        }>
                        <Row gutter={[16, 16]}>
                            <Col lg={12} md={24} xs={24}>
                                <Form.Item name="nombres" label="Nombres"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="nombres"
                                        maxLength={150}
                                        defaultValue={modelo.nombres ?? ''}
                                        value={modelo.nombres ?? ''}
                                        disabled={modelo && modelo.id > 0}
                                        onChange={(evt) => {
                                            if (modelo) {
                                                editar({ ...modelo, nombres: evt.target.value });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={24} xs={24}>
                                <Form.Item name="apellidos" label="Apellidos"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="apellidos"
                                        maxLength={150}
                                        defaultValue={modelo.apellidos}
                                        value={modelo.apellidos}
                                        disabled={modelo && modelo.id > 0}
                                        onChange={(evt) => {
                                            if (modelo) {
                                                editar({ ...modelo, apellidos: evt.target.value });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name="empleadoId" label="Empleado Id" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="empleadoId"
                                        maxLength={50}
                                        disabled={modelo && modelo.id > 0}
                                        defaultValue={modelo.empleadoId}
                                        value={modelo.empleadoId}
                                        onChange={(evt) => {
                                            if (modelo) {
                                                editar({ ...modelo, empleadoId: evt.target.value });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Form.Item name="documentoTipoId" label="Tipo de Documento" rules={[{ required: true, message: 'Obligatorio' }]}>
                                        <Select
                                            allowClear
                                            placeholder="Seleccione"
                                            defaultValue={modelo.documentoTipoId}
                                            value={modelo.documentoTipoId}
                                            disabled={modelo && modelo.id > 0}
                                            options={documentosTipos.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                            style={{ width: 150 }}
                                            onChange={(value: number) => {
                                                if (modelo) {
                                                    editar({
                                                        ...modelo,
                                                        documentoTipoId: value,
                                                        documentoTipo: documentosTipos.filter(opt => opt.id === value)[0]
                                                    });
                                                }
                                            }} />
                                    </Form.Item>
                                    <Form.Item name="documento" label="Documento" rules={[{ required: true, message: 'Obligatorio' }]}>
                                        <Input
                                            name="documento"
                                            width='100%'
                                            maxLength={50}
                                            defaultValue={modelo.documento}
                                            value={modelo.documento}
                                            disabled={modelo && modelo.id > 0}
                                            onChange={(evt) => {
                                                if (modelo) {
                                                    editar({ ...modelo, documento: evt.target.value });
                                                }
                                            }} />
                                    </Form.Item>
                                </Space.Compact>
                            </Col>
                            <Col lg={12} md={12} xs={24} sm={24}>
                                {
                                    modelo.id === 0
                                        ?
                                        <Form.Item name="fechaNacimiento" label="Fecha Nacimiento">
                                            <InputDatePicker
                                                name="fechaNacimiento"
                                                placeholder=""
                                                value={modelo.fechaNacimiento}
                                                disabled={modelo && modelo.id > 0}
                                                onChange={(date) => {
                                                    if (modelo) {
                                                        editar({ ...modelo, fechaNacimiento: !date ? '' : date.format(dateFormat) })
                                                    }
                                                }} />
                                        </Form.Item>
                                        :
                                        <Form.Item name="fechaNacimientoDisabled" label="Fecha Nacimiento">
                                            <Input
                                                disabled
                                                defaultValue={modelo.fechaNacimiento}
                                                value={modelo.fechaNacimiento} />
                                        </Form.Item>
                                }
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name="sexoId" label="Sexo" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Radio.Group
                                        block
                                        buttonStyle="solid"
                                        value={modelo?.sexo?.id}
                                        disabled={modelo && modelo.id > 0}
                                        onChange={(evt: RadioChangeEvent) => {
                                            const value: number = evt.target.value;
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    sexoId: value,
                                                    sexo: sexos.filter(opt => opt.id === value)[0]
                                                })
                                            }
                                        }}>
                                        {
                                            sexos.map(tipo => <Radio.Button key={tipo.id} value={tipo.id}>
                                                <Flex align="center" gap={10}>
                                                    {modelo && modelo.id > 0 && modelo.sexo?.id === tipo.id ? <IconCheckCircleColor style={{ fontSize: 20, color: Colors.Success }} /> : <></>}
                                                    <span>{tipo.nombre}</span>
                                                </Flex>
                                            </Radio.Button>)
                                        }
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            {
                                user && user.rol && user.rol.esAdmin
                                    ?
                                    <Col lg={12} md={12} sm={24} xs={24}>
                                        <Space>
                                            <Switch
                                                checked={modelo?.activo}
                                                onChange={(value) => {
                                                    if (modelo) {
                                                        editar({ ...modelo, activo: value })
                                                    }
                                                }} />
                                            <span>{modelo?.activo ? 'Activo' : 'Inactivo'}</span>
                                        </Space>
                                    </Col>
                                    : <></>
                            }
                        </Row>
                    </Container>

                    <Container
                        title={<Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Contacto</Typography.Title>}>
                        <Row gutter={[16, 16]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name="ciudadId" label="Ciudad" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        allowClear
                                        defaultValue={modelo.ciudadId}
                                        value={modelo.ciudadId}
                                        labelRender={(item) => !item ? <></> : <span>{item.label}</span>}
                                        options={ciudades.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    ciudadId: value,
                                                    ciudad: ciudades.filter(opt => opt.id === value)[0]
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name="ocupacionId" label="Ocupaci&oacute;n"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        id="ocupacionId"
                                        allowClear
                                        defaultValue={modelo.ocupacionId}
                                        value={modelo.ocupacionId}
                                        disabled={modelo && modelo.id > 0}
                                        labelRender={(item) => !item ? <></> : <span>{item.label}</span>}
                                        options={ocupaciones.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        onChange={(value) => {
                                            if (modelo) {
                                                editar({
                                                    ...modelo,
                                                    ocupacionId: value,
                                                    ocupacion: ocupaciones.filter(opt => opt.id === value)[0]
                                                });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item name="direccion" label="Direcci&oacute;n">
                                    <Input
                                        name="direccion"
                                        maxLength={250}
                                        defaultValue={modelo.direccion}
                                        value={modelo.direccion}
                                        onChange={(evt) => {
                                            if (modelo) {
                                                editar({ ...modelo, direccion: evt.target.value });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <Form.Item name="telefonoCelular" label="Telefono Celular" rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="telefonoCelular"
                                        maxLength={15}
                                        defaultValue={modelo.telefonoCelular}
                                        value={modelo?.telefonoCelular}
                                        onChange={(evt) => {
                                            if (modelo) {
                                                editar({ ...modelo, telefonoCelular: evt.target.value });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <Form.Item name="telefonoFijo" label="Telefono Fijo"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="telefonoFijo"
                                        maxLength={15}
                                        defaultValue={modelo.telefonoFijo}
                                        value={modelo?.telefonoFijo}
                                        onChange={(evt) => {
                                            if (modelo) {
                                                editar({ ...modelo, telefonoFijo: evt.target.value });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                {
                                    modelo.id === 0
                                        ?
                                        <Form.Item name="fechaAntiguedad" label="Fecha Antiguedad">
                                            <InputDatePicker
                                                name="fechaAntiguedad"
                                                placeholder=""
                                                value={modelo.fechaAntiguedad}
                                                disabled={modelo && modelo.id > 0}
                                                onChange={(date) => {
                                                    if (modelo) {
                                                        editar({ ...modelo, fechaAntiguedad: !date ? '' : date.format(dateFormat) })
                                                    }
                                                }} />
                                        </Form.Item>
                                        :
                                        <Form.Item name="fechaAntiguedadDisabled" label="Fecha Antiguedad">
                                            <Input
                                                disabled
                                                defaultValue={modelo.fechaAntiguedad}
                                                value={modelo.fechaAntiguedad} />
                                        </Form.Item>
                                }
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Col >
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}