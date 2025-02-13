import { useEffect } from "react"
import InputText from "@components/inputs/text"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Prestamo } from "@interfaces/prestamos"
import { Card, Col, Flex, Form, Image, Radio, Row, Segmented, Space, Typography } from "antd"
import Container from "@components/containers/container"
import { ButtonPrimary } from "@components/buttons/primary"
import { useNavigate } from "react-router-dom"
import { useConstants } from "@hooks/useConstants"
import { ButtonDefault } from "@components/buttons/default"
import InputDate from "@components/inputs/date"
import InputSelect from "@components/selects/select"

export default function FormPrestamo() {

    const {
        contextPrestamos: { state: { modelo }, nuevo, agregar, actualizar, cancelar },
        contextDocumentosTipos: { state: { datos: documentosTipos }, todos: cargarDocumentosTipos },
        contextSexos: { state: { datos: sexos }, todos: cargarSexos },
        contextCiudades: { state: { datos: ciudades }, todos: cargarCiudades },
        contextOcupaciones: { state: { datos: ocupaciones }, todos: cargarOcupaciones },
    } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Prestamo | undefined>(modelo)
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
        nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`, { replace: true })
    }

    useEffect(() => { nuevo(); cargarAuxiliares(); }, [])
    useEffect(() => { editar(modelo) }, [modelo])

    return (
        <>
            <Col span={20} offset={2}>
                <Title level={2} style={{ fontWeight: 300 }}>Formulario de C&aacute;lculo y Registro de Prestamo</Title>
                <Form
                    name="FormPrestamo"
                    layout="vertical"
                    autoComplete="off"
                    size="large"
                    initialValues={{
                        ...modelo,
                    }}>

                    <Flex gap={16} vertical>

                        <Container
                            title="Datos del Cliente">
                            <Row gutter={[10, 10]}>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Flex vertical>
                                        <Radio.Group options={documentosTipos.map(tipo => ({ value: tipo.id, label: tipo.nombre }))} />
                                        <InputText name="clienteDocumento" value={entidad?.cliente?.documento || ''}
                                            rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                    </Flex>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <InputText name="codigo" label="C&oacute;digo" value={entidad?.codigo || ''} disabled
                                        style={{ marginBottom: 6 }}
                                        rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <InputText name="empleadoId" label="Empleado Id" disabled value={entidad?.cliente?.empleadoId || ''}
                                        rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <InputText name="clienteNombre" label="Nombres y Apellidos" value={`${entidad?.cliente?.apellidos} ${entidad?.cliente?.apellidos}`.trim()} disabled
                                        style={{ marginBottom: 6 }}
                                        rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <InputText name="clienteOcupacion" label="Ocupaci&oacute;n" disabled value={entidad?.cliente?.ocupacion?.nombre || ''}
                                        rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <InputText name="telefonoCelular" label="Telefono Celular" disabled value={entidad?.cliente?.telefonoCelular || ''}
                                        rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <InputText name="telefonoFijo" label="Telefono Fijo" disabled value={entidad?.cliente?.telefonoFijo || ''}
                                        rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                </Col>
                            </Row>
                        </Container>

                        <Container
                            title="Prestamo">
                            <Row gutter={[10, 10]}>
                                <Col lg={8} md={8} xs={24}>
                                    <InputText name="nombres" label="Nombres" maxLength={25} value={entidad?.codigo || ''} disabled={!esNuevo}
                                        style={{ marginBottom: 6 }}
                                        rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                                </Col>
                                <Col lg={8} md={8} xs={24}>
                                    <InputDate
                                        name="fechaNacimiento"
                                        label="Fecha Nacimiento"
                                        placeholder=""
                                        value={entidad?.fechaCredito}
                                        disabled={!esNuevo}
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                        style={{ width: '100%' }}
                                        onChange={(date) => {
                                            if (entidad) {
                                                editar({ ...entidad, fechaCredito: date.toISOString() })
                                            }
                                        }} />
                                </Col>
                            </Row>

                        </Container>

                    </Flex>
                    <Row gutter={10}>
                        <Col lg={16} md={16} sm={24}>
                            <Row gutter={[10, 10]}>
                                <Col lg={12} md={24} xs={24}>
                                    <InputText name="nombres" label="Nombres" maxLength={25} value={entidad?.codigo || ''} disabled={!esNuevo}
                                        style={{ marginBottom: 6 }}
                                        rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
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
            </Col >
        </>
    )
}