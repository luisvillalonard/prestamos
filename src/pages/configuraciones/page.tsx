import { ButtonPrimary } from "@components/buttons/primary"
import TitlePage from "@components/titles/titlePage"
import { Colors } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Configuracion } from "@interfaces/configuraciones"
import { Col, Divider, Flex, Form, Row, Space, Switch } from "antd"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function PageConfiguraiones() {

    const {
        contextConfiguracionesGenerales: { state: { modelo }, nuevo, agregar, actualizar, ultima },
    } = useData()
    const { entidad, editar } = useForm<Configuracion | undefined>(modelo)
    useParams();

    const cargarUltima = async () => {

        const result = await ultima();
        if (result && result.ok) {
            if (result.datos) {
                editar(result.datos)
            } else {
                nuevo()
            }
        } else {
            nuevo()
        }

    }

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
                Alerta('Situación inesperada tratando de guardar los datos de la configuración.');
            } else if (!resp.ok) {
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos de la configuración.');
            } else {
                if (resp.datos) {
                    editar(resp.datos)
                }
                Exito(`Configuraciones generales guardadas exitosamente!`);
            }
        }
    }

    useEffect(() => { cargarUltima() }, [])
    useEffect(() => { if (modelo) editar(modelo) }, [modelo])

    return (
        <Col span={18} offset={3}>

            <Flex align="center" justify="space-between">
                <TitlePage title="Configuraciones Generales" />
                <Space>
                    <ButtonPrimary htmlType="submit" form="FormConfiguraciones">
                        Guardar
                    </ButtonPrimary>
                </Space>
            </Flex>
            <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />

            <Form
                name="FormConfiguraciones"
                layout="vertical"
                autoComplete="off"
                size="large"
                initialValues={modelo}
                onFinish={guardar}>
                <Row gutter={[10, 10]}>
                    <Col xs={24}>
                        <Space>
                            <Switch
                                checked={entidad?.permiteFechaAnteriorHoy}
                                onChange={(value) => {
                                    if (entidad) {
                                        editar({ ...entidad, permiteFechaAnteriorHoy: value })
                                    }
                                }} />
                            <span>El sistema permitir&aacute; que se registren prestamos con una fecha anterior a la del d&iacute;a de hoy</span>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Col>
    )
}