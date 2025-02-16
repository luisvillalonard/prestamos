import Container from "@components/containers/container"
import InputText from "@components/inputs/text"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Prestamo } from "@interfaces/prestamos"
import { Col, Flex, Form, Radio, Row, Typography } from "antd"
import { useEffect } from "react"

export default function FormPrestamo() {

    const {
        contextPrestamos: { state: { modelo }, nuevo },
        contextDocumentosTipos: { state: { datos: documentosTipos }, todos: cargarDocumentosTipos },
    } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Prestamo | undefined>(modelo)
    const { Title } = Typography

    const cargarAuxiliares = async () => await Promise.all([cargarDocumentosTipos()])

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


                        </Container>

                    </Flex>

                </Form>
            </Col >
        </>
    )
}