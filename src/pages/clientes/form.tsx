import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import FormItem from "@components/forms/item"
import InputText from "@components/inputs/text"
import TitlePage from "@components/titles/titlePage"
import TitleSesion from "@components/titles/titleSesion"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Cliente } from "@interfaces/clientes"
import { Col, DatePicker, Divider, Flex, Form, Input, Radio, RadioChangeEvent, Row, Select, Space, Switch, Tag, Typography } from "antd"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default function FormCliente() {

    const {
        contextClientes: { state: { modelo }, editar: modificar, agregar, actualizar, cancelar },
        contextDocumentosTipos: { state: { datos: documentosTipos }, todos: cargarDocumentosTipos },
        contextSexos: { state: { datos: sexos }, todos: cargarSexos },
        contextCiudades: { state: { datos: ciudades }, todos: cargarCiudades },
        contextOcupaciones: { state: { datos: ocupaciones }, todos: cargarOcupaciones },
    } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Cliente | undefined>(modelo)
    const nav = useNavigate()
    const { Title } = Typography
    useParams();

    const cargarAuxiliares = async () => await Promise.all([cargarDocumentosTipos(), cargarSexos(), cargarCiudades(), cargarOcupaciones()])

    const guardar = async () => {

        if (entidad) {

            let resp;
            const esNuevo = entidad.id === 0;

            if (esNuevo) {
                resp = await agregar(entidad);
            } else {
                resp = await actualizar(entidad);
            }

            if (!resp) {
                Alerta('Situación inesperada tratando de guardar los datos del país.');
            } else if (!resp.ok) {
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del país.');
            } else {
                if (resp.datos) {
                    modificar(resp.datos)
                }
                Exito(`País ${esNuevo ? 'registrado' : 'actualizado'}  exitosamente!`);
            }
        }
    }

    const onClose = () => {
        cancelar();
        nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Historico}`, { replace: true });
    }

    useEffect(() => { cargarAuxiliares() }, [])

    return (
        <>
            <Col span={18} offset={3}>

                <Flex align="center" justify="space-between">
                    <TitlePage title="Formulario de Cliente" />
                    <Space>
                        <ButtonDefault key="1" size="large" htmlType="button" onClick={onClose}>Ir a Clientes</ButtonDefault>
                        <ButtonPrimary key="2" size="large" htmlType="submit" form="FormCliente">
                            {entidad && entidad.id > 0 ? 'Actualizar' : 'Guardar'}
                        </ButtonPrimary>
                    </Space>
                </Flex>
                <Divider className='my-3' />

                <Form
                    name="FormCliente"
                    layout="vertical"
                    autoComplete="off"
                    size="large"
                    initialValues={{
                        ...modelo,
                        documentoTipoId: modelo?.documentoTipo?.id,
                        sexoId: modelo?.sexo?.id,
                        ciudadId: modelo?.ciudad?.id,
                        ocupacionId: modelo?.ocupacion?.id,
                    }}
                    onFinish={guardar}>
                    <Row gutter={[15, 14]}>
                        <Col xs={24}>
                            <Flex align="center" justify="space-between">
                                <TitleSesion title="Generales" color={Colors.Primary} />
                                <Space>
                                    <Title level={4} style={{ fontWeight: 'bolder', margin: 0 }}>C&oacute;digo</Title>
                                    {
                                        !entidad?.codigo
                                            ? <Tag style={{ fontSize: 16, borderRadius: 10 }}>C-00000</Tag>
                                            : <Tag color='blue' style={{ fontSize: 16, borderRadius: 10 }}>{entidad.codigo}</Tag>
                                    }
                                </Space>
                            </Flex>
                            <Divider className="my-1 mb-2" />
                        </Col>
                        <Col lg={12} md={24} xs={24}>
                            <FormItem name="nombres" label="Nombres"
                                rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Input
                                    maxLength={150}
                                    value={entidad?.nombres || ''}
                                    disabled={entidad && entidad.id > 0}
                                    onChange={handleChangeInput} />
                            </FormItem>
                        </Col>
                        <Col lg={12} md={24} xs={24}>
                            <FormItem name="apellidos" label="Apellidos"
                                rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Input
                                    maxLength={150}
                                    value={entidad?.apellidos || ''}
                                    disabled={entidad && entidad.id > 0}
                                    onChange={handleChangeInput} />
                            </FormItem>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <FormItem name="empleadoId" label="Empleado Id"
                                rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Input
                                    maxLength={50}
                                    disabled={entidad && entidad.id > 0}
                                    value={entidad?.empleadoId || ''}
                                    onChange={handleChangeInput} />
                            </FormItem>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <FormItem name="documentoTipoId" label="Tipo de Documento"
                                rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Select
                                        allowClear
                                        defaultValue={entidad?.documentoTipo?.id}
                                        disabled={entidad && entidad.id > 0}
                                        options={documentosTipos.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                        style={{ width: 90 }}
                                        onChange={(value: number) => {
                                            if (entidad) {
                                                editar({ ...entidad, documentoTipo: documentosTipos.filter(opt => opt.id === value).shift() });
                                            }
                                        }} />
                                    <Input
                                        width='100%'
                                        maxLength={50}
                                        value={entidad?.documento || ''}
                                        disabled={entidad && entidad.id > 0}
                                        onChange={handleChangeInput} />
                                </Space.Compact>
                            </FormItem>
                        </Col>
                        <Col lg={12} md={12} xs={24} sm={24}>
                            <FormItem name="fechaNacimiento" label="Fecha Nacimiento">
                                {
                                    entidad?.id === 0
                                        ?
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder=""
                                            onChange={(date) => {
                                                if (entidad) {
                                                    editar({ ...entidad, fechaNacimiento: !date ? undefined : date.toISOString().substring(0, 10) })
                                                }
                                            }} />
                                        : <InputText value={entidad?.fechaNacimiento} disabled />
                                }
                            </FormItem>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <FormItem name="sexoId" label="Sexo"
                                rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Radio.Group
                                    block
                                    value={entidad?.sexo?.id}
                                    disabled={entidad && entidad.id > 0}
                                    onChange={(evt: RadioChangeEvent) => {
                                        const value: number = evt.target.value;
                                        if (entidad) {
                                            editar({ ...entidad, sexo: sexos.filter(opt => opt.id === value).shift() })
                                        }
                                    }}>
                                    {sexos.map(tipo => <Radio.Button type="primary" key={tipo.id} value={tipo.id}>{tipo.nombre}</Radio.Button>)}
                                </Radio.Group>
                            </FormItem>
                        </Col>
                        <Col xs={24} style={{ paddingTop: 20 }}>
                            <TitleSesion title="Contacto" color={Colors.Primary} />
                            <Divider className="my-1 mb-2" />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <FormItem name="ciudadId" label="Ciudad"
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
                            </FormItem>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <FormItem name="ocupacionId" label="Ocupaci&oacute;n"
                                rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Select
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
                            </FormItem>
                        </Col>
                        <Col xs={24}>
                            <FormItem name="direccion" label="Direcci&oacute;n">
                                <Input
                                    maxLength={250}
                                    value={entidad?.direccion || ''}
                                    onChange={handleChangeInput} />
                            </FormItem>
                        </Col>
                        <Col lg={8} md={8} sm={24}>
                            <FormItem name="telefonoCelular" label="Telefono Celular"
                                rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Input
                                    maxLength={15}
                                    value={entidad?.telefonoCelular || ''}
                                    onChange={handleChangeInput} />
                            </FormItem>
                        </Col>
                        <Col lg={8} md={8} sm={24}>
                            <FormItem name="telefonoFijo" label="Telefono Fijo"
                                rules={[{ required: true, message: 'Obligatorio' }]}>
                                <Input
                                    maxLength={15}
                                    value={entidad?.telefonoFijo || ''}
                                    onChange={handleChangeInput} />
                            </FormItem>
                        </Col>
                        <Col lg={8} md={8} sm={24}>
                            <FormItem name="fechaAntiguedad" label="Fecha Antiguedad">
                                {
                                    entidad?.id === 0
                                        ?
                                        <DatePicker
                                            placeholder=""
                                            disabled={entidad && entidad.id > 0}
                                            style={{ width: '100%' }}
                                            onChange={(date) => {
                                                if (entidad) {
                                                    editar({ ...entidad, fechaAntiguedad: !date ? undefined : date.toISOString().substring(0, 10) })
                                                }
                                            }} />
                                        :
                                        <InputText
                                            value={entidad?.fechaNacimiento}
                                            style={{ width: '100%' }}
                                            disabled
                                            onChange={handleChangeInput} />
                                }
                            </FormItem>
                        </Col>
                        <Col sm={24} xs={24}>
                            <FormItem>
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
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Col >
        </>
    )
}