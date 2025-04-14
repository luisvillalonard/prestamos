import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import { InputDatePicker } from "@components/inputs/date"
import TitlePage from "@components/titles/titlePage"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { dateFormat } from "@hooks/useDate"
import { useForm } from "@hooks/useForm"
import { IconCheckCircleColor } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Cliente } from "@interfaces/clientes"
import { Col, Flex, Form, Input, Radio, RadioChangeEvent, Row, Select, Space, Switch, Tag, Typography } from "antd"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function FormCliente() {

    const {
        contextClientes: { state: { modelo, procesando }, nuevo, editar: modificar, agregar, actualizar, cancelar },
        contextDocumentosTipos: { state: { datos: documentosTipos }, todos: cargarDocumentosTipos },
        contextSexos: { state: { datos: sexos }, todos: cargarSexos },
        contextCiudades: { state: { datos: ciudades }, todos: cargarCiudades },
        contextOcupaciones: { state: { datos: ocupaciones }, todos: cargarOcupaciones },
        contextAuth: { state: { user } },
    } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Cliente | undefined>(modelo)
    const nav = useNavigate()
    const url = useLocation()

    const cargarAuxiliares = async () => await Promise.all([cargarDocumentosTipos(), cargarSexos(), cargarCiudades(), cargarOcupaciones()])

    const guardar = async () => {

        if (entidad) {

            let resp;
            const esNuevo = entidad.id === 0;

            try {
                if (esNuevo) {
                    resp = await agregar(entidad);
                } else {
                    resp = await actualizar(entidad);
                }
            } catch (error: any) {
                Alerta(error.message || 'Situación inesperada tratando de guardar los datos del cliente.');
            }

            if (!resp) {
                modificar(entidad);
                Alerta('Situación inesperada tratando de guardar los datos del cliente.');

            } else if (!resp.ok) {
                modificar(entidad);
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del cliente.');

            } else {
                if (resp.datos) {
                    modificar(resp.datos)
                }
                Exito(`Cliente ${esNuevo ? 'registrado' : 'actualizado'}  exitosamente!`);
            }
        }
    }

    const onClose = () => {
        cancelar();
        nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Historico}`, { replace: true });
    }

    useEffect(() => {
        editar(modelo);
        if (modelo) {
            cargarAuxiliares()
        } else {
            nuevo()
        }
    }, [modelo, url.pathname])

    return (
        <>
            <Col span={18} offset={3}>

                <Flex align="center" justify="space-between" className="mb-3">
                    <TitlePage title="Formulario de Cliente" />
                    <Space>
                        <ButtonDefault key="1" size="large" htmlType="button" onClick={onClose}>Ir a Clientes</ButtonDefault>
                        <ButtonPrimary key="2" size="large" htmlType="submit" form="FormCliente">
                            {entidad && entidad.id > 0 ? 'Actualizar' : 'Guardar'}
                        </ButtonPrimary>
                    </Space>
                </Flex>

                <Form
                    name="FormCliente"
                    layout="vertical"
                    autoComplete="off"
                    size="large"
                    initialValues={{
                        ...entidad,
                        documentoTipoId: entidad?.documentoTipo?.id,
                        sexoId: entidad?.sexo?.id,
                        ciudadId: entidad?.ciudad?.id,
                        ocupacionId: entidad?.ocupacion?.id,
                    }}
                    onFinish={guardar}>

                    <Container className="mb-4"
                        title={
                            <Flex align="center" gap={10}>
                                <Typography.Title level={4} style={{ margin: 0, color: Colors.Primary }}>Generales</Typography.Title>
                                {
                                    user && user.rol && user.rol.esAdmin
                                        ? <></>
                                        : entidad?.activo === true
                                            ? <Tag color='green' style={{ fontSize: 16, borderRadius: 10 }}>Activo</Tag>
                                            : <Tag color='error' style={{ fontSize: 16, borderRadius: 10 }}>Inactivo</Tag>
                                }
                            </Flex>
                        }
                        extra={
                            <Flex align="center" gap={10}>
                                <Typography.Title level={4} style={{ fontWeight: 'bolder', margin: 0 }}>C&oacute;digo</Typography.Title>
                                {
                                    !entidad?.codigo
                                        ? <Tag style={{ fontSize: 16, borderRadius: 10 }}>C-00000</Tag>
                                        : <Tag color='blue' style={{ fontSize: 16, borderRadius: 10 }}>{entidad.codigo}</Tag>
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
                                        value={entidad?.nombres || ''}
                                        disabled={entidad && entidad.id > 0}
                                        onChange={handleChangeInput} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={24} xs={24}>
                                <Form.Item name="apellidos" label="Apellidos"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="apellidos"
                                        maxLength={150}
                                        value={entidad?.apellidos || ''}
                                        disabled={entidad && entidad.id > 0}
                                        onChange={handleChangeInput} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name="empleadoId" label="Empleado Id"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="empleadoId"
                                        maxLength={50}
                                        disabled={entidad && entidad.id > 0}
                                        value={entidad?.empleadoId || ''}
                                        onChange={handleChangeInput} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name="documentoTipoId" label="Tipo de Documento"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Space.Compact style={{ width: '100%' }}>
                                        <Select
                                            allowClear
                                            placeholder="Seleccione"
                                            defaultValue={entidad?.documentoTipo?.id}
                                            disabled={entidad && entidad.id > 0}
                                            options={documentosTipos.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                            style={{ width: 150 }}
                                            onChange={(value: number) => {
                                                if (entidad) {
                                                    editar({ ...entidad, documentoTipo: documentosTipos.filter(opt => opt.id === value).shift() });
                                                }
                                            }} />
                                        <Input
                                            name="documento"
                                            width='100%'
                                            maxLength={50}
                                            value={entidad?.documento || ''}
                                            disabled={entidad && entidad.id > 0}
                                            onChange={handleChangeInput} />
                                    </Space.Compact>
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} xs={24} sm={24}>
                                <Form.Item name="fechaNacimiento" label="Fecha Nacimiento">
                                    <InputDatePicker
                                        name="fechaNacimiento"
                                        placeholder=""
                                        value={entidad?.fechaNacimiento}
                                        disabled={entidad && entidad.id > 0}
                                        onChange={(date) => {
                                            if (entidad) {
                                                editar({ ...entidad, fechaNacimiento: !date ? '' : date.format(dateFormat) })
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name="sexoId" label="Sexo"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Radio.Group
                                        block
                                        buttonStyle="solid"
                                        value={entidad?.sexo?.id}
                                        disabled={entidad && entidad.id > 0}
                                        onChange={(evt: RadioChangeEvent) => {
                                            const value: number = evt.target.value;
                                            if (entidad) {
                                                editar({ ...entidad, sexo: sexos.filter(opt => opt.id === value).shift() })
                                            }
                                        }}>
                                        {
                                            sexos.map(tipo => <Radio.Button key={tipo.id} value={tipo.id}>
                                                <Flex align="center" gap={10}>
                                                    {entidad && entidad.id > 0 && entidad.sexo?.id === tipo.id ? <IconCheckCircleColor style={{ fontSize: 20, color: Colors.Success }} /> : <></>}
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
                                                checked={entidad?.activo}
                                                onChange={(value) => {
                                                    if (entidad) {
                                                        editar({ ...entidad, activo: value })
                                                    }
                                                }} />
                                            <span>{entidad?.activo ? 'Activo' : 'Inactivo'}</span>
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
                                <Form.Item name="ciudadId" label="Ciudad"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Select
                                        allowClear
                                        value={entidad?.ciudad?.id}
                                        labelRender={(item) => !item ? <></> : <span>{item.label}</span>}
                                        options={ciudades.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, ciudad: ciudades.filter(opt => opt.id === value).shift() });
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
                                        value={entidad?.ocupacion?.id}
                                        disabled={entidad && entidad.id > 0}
                                        labelRender={(item) => !item ? <></> : <span>{item.label}</span>}
                                        options={ocupaciones.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        onChange={(value) => {
                                            if (entidad) {
                                                editar({ ...entidad, ocupacion: ocupaciones.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item name="direccion" label="Direcci&oacute;n">
                                    <Input
                                        name="direccion"
                                        maxLength={250}
                                        value={entidad?.direccion || ''}
                                        onChange={handleChangeInput} />
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <Form.Item name="telefonoCelular" label="Telefono Celular"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="telefonoCelular"
                                        maxLength={15}
                                        value={entidad?.telefonoCelular || ''}
                                        onChange={handleChangeInput} />
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <Form.Item name="telefonoFijo" label="Telefono Fijo"
                                    rules={[{ required: true, message: 'Obligatorio' }]}>
                                    <Input
                                        name="telefonoFijo"
                                        maxLength={15}
                                        value={entidad?.telefonoFijo || ''}
                                        onChange={handleChangeInput} />
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <Form.Item name="fechaAntiguedad" label="Fecha Antiguedad">
                                    <InputDatePicker
                                        name="fechaAntiguedad"
                                        placeholder=""
                                        value={entidad?.fechaAntiguedad}
                                        disabled={entidad && entidad.id > 0}
                                        onChange={(date) => {
                                            if (entidad) {
                                                editar({ ...entidad, fechaAntiguedad: !date ? '' : date.format(dateFormat) })
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Col >
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}