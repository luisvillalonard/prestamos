import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import Container from "@components/containers/container"
import InputDate from "@components/inputs/date"
import InputRadioGroup from "@components/inputs/radioButton"
import InputText from "@components/inputs/text"
import RadioSwitch from "@components/radios/swich"
import InputSelect from "@components/selects/select"
import { useConstants } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Cliente } from "@interfaces/clientes"
import { Col, Form, Radio, RadioChangeEvent, Row, Space, Tag, Typography } from "antd"
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
    const { Title } = Typography
    const nav = useNavigate()
    const { Urls } = useConstants()
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
                //Alerta('Situación inesperada tratando de guardar los datos del país.');
            } else if (!resp.ok) {
                //Alerta('Situación inesperada tratando de guardar los datos del país.');
            } else {
                if (resp.datos) {
                    modificar(resp.datos)
                }
                //Exito(`País ${isNew ? 'registrado' : 'actualizado'}  exitosamente!`);
            }
        }
    }

    const onClose = () => {
        cancelar()
        nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Historico}`, { replace: true })
    }

    useEffect(() => { cargarAuxiliares() }, [])

    return (
        <>
            <Col span={18} offset={3}>
                <Title level={2} style={{ fontWeight: 300 }}>Formulario de Cliente</Title>
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
                    <Container
                        title={
                            <Space>
                                <span>C&oacute;digo</span>
                                {
                                    !entidad?.codigo
                                        ? <Tag style={{ fontSize: 16, borderRadius: 10 }}>C-00000</Tag>
                                        : <Tag color='blue' style={{ fontSize: 16, borderRadius: 10 }}>{entidad.codigo}</Tag>
                                }

                            </Space>

                        }
                        extra={
                            <Space>
                                <ButtonDefault key="1" htmlType="button" onClick={onClose}>Ir a Clientes</ButtonDefault>
                                <ButtonPrimary key="2" htmlType="submit" form="FormCliente">
                                    {entidad && entidad.id > 0 ? 'Actualizar' : 'Guardar'}
                                </ButtonPrimary>
                            </Space>
                        }>

                        <Row gutter={[10, 10]}>
                            <Col lg={12} md={24} xs={24}>
                                <InputText name="nombres" label="Nombres" maxLength={150} value={entidad?.nombres || ''}
                                    disabled={entidad && entidad.id > 0}
                                    rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                            </Col>
                            <Col lg={12} md={24} xs={24}>
                                <InputText name="apellidos" label="Apellidos" maxLength={150} value={entidad?.apellidos || ''}
                                    disabled={entidad && entidad.id > 0}
                                    rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <InputText name="empleadoId" label="Empleado Id" maxLength={50}
                                    disabled={entidad && entidad.id > 0}
                                    value={entidad?.empleadoId || ''}
                                    rules={[{ required: true, message: 'Obligatorio' }]}
                                    onChange={handleChangeInput} />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <label style={{ marginBottom: 5 }}>Tipo de Documento</label>
                                    <Space.Compact style={{ width: '100%' }}>
                                        <InputSelect
                                            name="documentoTipoId"
                                            allowClear
                                            value={entidad?.ciudad?.id}
                                            disabled={entidad && entidad.id > 0}
                                            labelRender={(item) => !item ? <></> : <span>{item.label}</span>}
                                            options={documentosTipos.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                            rules={[{ required: true, message: 'Obligatorio' }]}
                                            style={{ width: 90 }}
                                            onChange={(value) => {
                                                if (entidad) {
                                                    editar({ ...entidad, documentoTipo: documentosTipos.filter(opt => opt.id === value).shift() });
                                                }
                                            }} />
                                        <InputText name="documento" maxLength={50} value={entidad?.documento || ''} style={{ width: '100%' }}
                                            disabled={entidad && entidad.id > 0}
                                            rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                    </Space.Compact>
                                </Space>
                            </Col>
                            <Col lg={12} md={12} xs={24} sm={24}>
                                {
                                    entidad?.id === 0
                                        ?
                                        <InputDate
                                            name="fechaNacimiento"
                                            label="Fecha Nacimiento"
                                            placeholder=""
                                            value={undefined}
                                            onChange={(date) => {
                                                if (entidad) {
                                                    editar({ ...entidad, fechaNacimiento: !date ? undefined : date.toISOString().substring(0, 10) })
                                                }
                                            }} />
                                        :
                                        <InputText name="fechaNacimiento" label="Fecha Nacimiento" value={entidad?.fechaNacimiento} />
                                }
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <InputRadioGroup
                                    block
                                    name="sexoId"
                                    label="Sexo"
                                    value={entidad?.sexo?.id}
                                    disabled={entidad && entidad.id > 0}
                                    rules={[{ required: true, message: 'Obligatorio' }]}
                                    onChange={(evt: RadioChangeEvent) => {
                                        const value: number = evt.target.value;
                                        if (entidad) {
                                            editar({ ...entidad, sexo: sexos.filter(opt => opt.id === value).shift() })
                                        }
                                    }}>
                                    {sexos.map(tipo => <Radio.Button type="primary" key={tipo.id} value={tipo.id}>{tipo.nombre}</Radio.Button>)}
                                </InputRadioGroup>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <InputSelect
                                    name="ciudadId"
                                    label="Ciudad"
                                    allowClear
                                    value={entidad?.ciudad?.id}
                                    labelRender={(item) => !item ? <></> : <span>{item.label}</span>}
                                    options={ciudades.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                    rules={[{ required: true, message: 'Obligatorio' }]}
                                    onChange={(value) => {
                                        if (entidad) {
                                            editar({ ...entidad, ciudad: ciudades.filter(opt => opt.id === value).shift() });
                                        }
                                    }} />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <InputSelect
                                    name="ocupacionId"
                                    label="Ocupaci&oacute;n"
                                    allowClear
                                    value={entidad?.ocupacion?.id}
                                    disabled={entidad && entidad.id > 0}
                                    labelRender={(item) => !item ? <></> : <span>{item.label}</span>}
                                    options={ocupaciones.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                                    rules={[{ required: true, message: 'Obligatorio' }]}
                                    onChange={(value) => {
                                        if (entidad) {
                                            editar({ ...entidad, ocupacion: ocupaciones.filter(opt => opt.id === value).shift() });
                                        }
                                    }} />
                            </Col>
                            <Col xs={24}>
                                <InputText name="direccion" label="Direcci&oacute;n" maxLength={250} value={entidad?.direccion || ''}
                                    onChange={handleChangeInput} />
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <InputText name="telefonoCelular" label="Telefono Celular" maxLength={15} value={entidad?.telefonoCelular || ''}
                                    rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <InputText name="telefonoFijo" label="Telefono Fijo" maxLength={15} value={entidad?.telefonoFijo || ''}
                                    rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                {
                                    entidad?.id === 0
                                        ?
                                        <InputDate
                                            name="fechaAntiguedad"
                                            label="Fecha Antiguedad"
                                            placeholder=""
                                            value={undefined}
                                            disabled={entidad && entidad.id > 0}
                                            style={{ width: '100%' }}
                                            onChange={(date) => {
                                                if (entidad) {
                                                    editar({ ...entidad, fechaAntiguedad: !date ? undefined : date.toISOString().substring(0, 10) })
                                                }
                                            }} />
                                        :
                                        <InputText name="fechaAntiguedad" label="Fecha Antiguedad" value={entidad?.fechaNacimiento} style={{ width: '100%' }}
                                            disabled onChange={handleChangeInput} />
                                }
                            </Col>
                            <Col sm={24} xs={24}>
                                <RadioSwitch
                                    label={entidad?.activo ? 'Activo' : 'Inactivo'}
                                    checked={entidad?.activo}
                                    onChange={(value) => {
                                        if (entidad) {
                                            editar({ ...entidad, activo: value })
                                        }
                                    }} />
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Col >
        </>
    )
}