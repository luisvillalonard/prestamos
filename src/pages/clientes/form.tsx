import { useEffect } from "react"
import InputText from "@components/inputs/text"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Cliente } from "@interfaces/clientes"
import { Col, Flex, Form, Image, Row, Segmented, Space, Typography } from "antd"
import Container from "@components/containers/container"
import { ButtonPrimary } from "@components/buttons/primary"
import { useNavigate } from "react-router-dom"
import { useConstants } from "@hooks/useConstants"
import { ButtonDefault } from "@components/buttons/default"
import InputDate from "@components/inputs/date"
import InputSelect from "@components/selects/select"

export default function FormCliente() {

    const {
        contextClientes: { state: { modelo }, nuevo, agregar, actualizar, cancelar },
        contextDocumentosTipos: { state: { datos: documentosTipos }, todos: cargarDocumentosTipos },
        contextSexos: { state: { datos: sexos }, todos: cargarSexos },
        contextCiudades: { state: { datos: ciudades }, todos: cargarCiudades },
        contextOcupaciones: { state: { datos: ocupaciones }, todos: cargarOcupaciones },
    } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Cliente | undefined>(modelo)
    const { Title } = Typography
    const nav = useNavigate()
    const { Urls } = useConstants()
    const esNuevo = !entidad || entidad?.id === 0

    const cargarAuxiliares = async () => await Promise.all([cargarDocumentosTipos(), cargarSexos(), cargarCiudades(), cargarOcupaciones()])

    const guardar = async () => {

        if (entidad) {

            let resp;
            if (esNuevo) {
                resp = await agregar(entidad);
            } else {
                resp = await actualizar(entidad);
            }

            /* if (!resp) {
                Alerta('Situación inesperada tratando de guardar los datos del país.');
            } else if (!resp.success) {
                Alerta('Situación inesperada tratando de guardar los datos del país.');
            } else {
                Exito(`País ${isNew ? 'registrado' : 'actualizado'}  exitosamente!`);
            } */
        }
    }

    const onClose = () => {
        cancelar()
        nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Historico}`, { replace: true })
    }

    useEffect(() => { nuevo(); cargarAuxiliares(); }, [])
    useEffect(() => { editar(modelo) }, [modelo])

    return (
        <>
            <Col span={20} offset={2}>
                <Title level={2} style={{ fontWeight: 300 }}>Formulario de Cliente</Title>
                <Container
                    title={
                        <span>C&oacute;digo: {`${esNuevo ? '000000' : entidad?.codigo}`}</span>
                    }
                    extra={
                        <Space>
                            <ButtonDefault htmlType="button" onClick={onClose}>Cancelar</ButtonDefault>
                            <ButtonPrimary htmlType="submit" form="FormCliente" onClick={guardar}>Actualizar</ButtonPrimary>
                        </Space>
                    }>
                    <Form
                        name="FormCliente"
                        layout="vertical"
                        autoComplete="off"
                        size="large"
                        initialValues={{
                            ...modelo,
                            documentoId: entidad?.documento?.id,
                            ciudadId: entidad?.ciudad?.id,
                            ocupacionId: entidad?.ocupacion?.id,
                        }}>

                        <Row gutter={[10, 10]}>
                            <Col lg={8} md={8} sm={24}>
                                <Image
                                    width="100%"
                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                            </Col>
                            <Col lg={16} md={16} sm={24}>
                                <Row gutter={[10, 10]}>
                                    <Col lg={12} md={24} xs={24}>
                                        <InputText name="nombres" label="Nombres" maxLength={25} value={entidad?.nombres || ''} disabled={!esNuevo}
                                            style={{ marginBottom: 6 }}
                                            rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                    </Col>
                                    <Col lg={12} md={24} xs={24}>
                                        <InputText name="apellidos" label="Apellidos" maxLength={25} value={entidad?.apellidos || ''} disabled={!esNuevo}
                                            style={{ marginBottom: 6 }}
                                            rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                    </Col>
                                    <Col lg={12} md={12} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                        <InputText name="empleadoId" label="Empleado Id" maxLength={50} value={entidad?.empleadoId || ''} style={{ width: '100%', margin: 0 }}
                                            rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                    </Col>
                                    <Col lg={12} md={12} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                        <Space>
                                            <label>Tipo de Documento</label>
                                            <Segmented<number>
                                                size="large"
                                                options={documentosTipos.map(tipo => ({ value: tipo.id, label: tipo.nombre }))}
                                                onChange={(value) => {
                                                    if (entidad) {
                                                        editar({ ...entidad, documento: documentosTipos.filter(opt => opt.id === value).shift() });
                                                    }
                                                }} />
                                        </Space>
                                        <Flex style={{}}>
                                            <InputText name="documentoId" maxLength={50} value={entidad?.documento?.id || ''} style={{ width: '100%', margin: 0 }}
                                                rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                        </Flex>
                                    </Col>
                                    <Col lg={12} md={12} xs={24} sm={24} style={{ alignSelf: 'end' }}>
                                        <InputDate
                                            name="fechaNacimiento"
                                            label="Fecha Nacimiento"
                                            placeholder=""
                                            value={entidad?.fechaNacimiento}
                                            disabled={!esNuevo}
                                            rules={[{ required: true, message: 'Obligatorio' }]}
                                            style={{ width: '100%' }}
                                            onChange={(date) => {
                                                if (entidad) {
                                                    editar({ ...entidad, fechaNacimiento: !date ? undefined : date.toISOString() })
                                                }
                                            }} />
                                    </Col>
                                    <Col lg={12} md={12} sm={24} xs={24} style={{ alignSelf: 'end' }}>
                                        <Space direction="vertical">
                                            <label>Sexo</label>
                                            <Segmented<number>
                                                size="large"
                                                options={sexos.map(tipo => ({ value: tipo.id, label: tipo.nombre }))}
                                                value={entidad?.sexo?.id}
                                                onChange={(value) => {
                                                    if (entidad) {
                                                        editar({ ...entidad, sexo: sexos.filter(opt => opt.id === value).shift() });
                                                    }
                                                }} />
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutter={[10, 10]}>
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
                                <InputText name="direccion" label="Direcci&oacute;n" maxLength={50} value={entidad?.direccion || ''}
                                    rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <InputText name="telefonoCelular" label="Telefono Celular" maxLength={50} value={entidad?.telefonoCelular || ''}
                                    rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <InputText name="telefonoFijo" label="Telefono Fijo" maxLength={50} value={entidad?.telefonoFijo || ''}
                                    rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                            </Col>
                            <Col lg={8} md={8} sm={24}>
                                <InputDate
                                    name="fechaAntiguedad"
                                    label="Fecha Antiguedad"
                                    placeholder=""
                                    value={entidad?.fechaAntiguedad}
                                    disabled={!esNuevo}
                                    rules={[{ required: true, message: 'Obligatorio' }]}
                                    style={{ width: '100%' }}
                                    onChange={(date) => {
                                        if (entidad) {
                                            editar({ ...entidad, fechaAntiguedad: !date ? undefined : date.toISOString() })
                                        }
                                    }} />
                            </Col>
                        </Row>

                    </Form>
                </Container>
            </Col >
        </>
    )
}