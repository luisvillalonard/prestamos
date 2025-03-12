import { ButtonDefault } from "@components/buttons/default"
import { ButtonPrimary } from "@components/buttons/primary"
import Loading from "@components/containers/loading"
import FormItem from "@components/forms/item"
import { menuItems } from "@components/layout/menu"
import TitlePage from "@components/titles/titlePage"
import TitleSesion from "@components/titles/titleSesion"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { MenuItem, Permiso, Rol } from "@interfaces/seguridad"
import { Avatar, Col, Divider, Flex, Form, Input, List, Row, Space, Switch } from "antd"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function FormPermisos() {

    const {
        contextAuth: { state: { user }, LoggedIn },
        contextPermisos: { state: { modelo, procesando }, agregar, actualizar, cancelar },
    } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Rol | undefined>(modelo)
    const nav = useNavigate()

    const changePermition = (item: MenuItem) => {

        if (entidad) {

            let oldPermition: Permiso[] = entidad.permisos;
            const permition = entidad.permisos.filter(child => child.menuId === item.menuid).shift();

            if (!permition) {
                oldPermition.push({
                    id: 0,
                    rolId: entidad.id,
                    menuId: item.menuid,
                } as Permiso);
            } else {
                oldPermition = entidad.permisos.filter(perm => perm.menuId !== item.menuid)
            }

            editar({ ...entidad, permisos: oldPermition });
        }

    }

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

                if (!resp) {
                    Alerta('Situación inesperada tratando de guardar los permisos del perfíl.');
                } else if (!resp.ok) {
                    Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los permisos del perfíl.');
                } else {

                    // Si el rol modificado es el que tiene el usuario logeado en la aplicación, lo actualizo
                    if (user?.rol?.id === entidad.id) {
                        LoggedIn({ ...user, rol: entidad })
                    }

                    // Muestro el mensaje de exito
                    Exito(
                        `Rol y permisos ${esNuevo ? 'registrados' : 'actualizados'}  exitosamente!`,
                        () => nav(`/${Urls.Seguridad.Base}/${Urls.Seguridad.Permisos}`, { replace: true })
                    );
                }
            } catch (error: any) {
                Alerta(error.message || 'Situación inesperada tratando de guardar los datos.');
            }

        }
    }

    const onClose = () => {
        cancelar();
        nav(`/${Urls.Seguridad.Base}/${Urls.Seguridad.Permisos}`, { replace: true });
    }

    useEffect(() => { editar(modelo) }, [modelo])

    if (!entidad) {
        return <></>
    }

    return (
        <>
            <Col span={18} offset={3}>

                <TitlePage title="Rol y Permisos" />
                <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />
                <Flex align="center" justify="end" className="mb-3">
                    <Space>
                        <ButtonDefault key="1" htmlType="button" onClick={onClose}>Ir a Perf&iacute;les</ButtonDefault>
                        <ButtonPrimary key="2" htmlType="submit" form="FormPermisos">
                            {entidad && entidad.id > 0 ? 'Actualizar' : 'Guardar'}
                        </ButtonPrimary>
                    </Space>
                </Flex>
                <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />

                <Form
                    name="FormPermisos"
                    layout="vertical"
                    autoComplete="off"
                    size="large"
                    initialValues={modelo}
                    onFinish={guardar}>
                    <Row gutter={[30, 20]}>
                        <Col lg={12} md={12} xs={24}>
                            <TitleSesion title="Rol de Usuario" color={Colors.Primary} />
                            <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />

                            <Row gutter={[10, 10]}>
                                <Col xs={24}>
                                    <FormItem name="nombre" label="Nombre" rules={[{ required: true, message: 'Obligatorio' }]}>
                                        <Input
                                            name="nombre"
                                            maxLength={50}
                                            value={entidad?.nombre || ''}
                                            onChange={handleChangeInput} />
                                    </FormItem>
                                </Col>
                                <Col xs={24}>
                                    <FormItem name="descripcion" label="Descripci&oacute;n">
                                        <Input.TextArea
                                            name="descripcion"
                                            maxLength={250}
                                            rows={3}
                                            style={{ resize: 'none' }}
                                            value={entidad?.descripcion || ''}
                                            onChange={handleChangeInput} />
                                    </FormItem>
                                </Col>
                                <Col xs={24}>
                                    <FormItem name="esAdmin" valuePropName="checked">
                                        <Space>
                                            <Switch
                                                checked={entidad.esAdmin}
                                                onChange={(checked) => editar({ ...entidad, esAdmin: checked })} />
                                            <span>Este rol define al usuario como un Administrador del sistema</span>
                                        </Space>
                                    </FormItem>
                                </Col>
                                <Col xs={24}>
                                    <FormItem name="activo" valuePropName="checked">
                                        <Space>
                                            <Switch
                                                checked={entidad.activo}
                                                onChange={(checked) => editar({ ...entidad, activo: checked })} />
                                            <span>{entidad.activo ? 'Activo' : 'Inactivo'}</span>
                                        </Space>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={12} md={12} xs={24}>
                            <TitleSesion title="Permisos" color={Colors.Primary} />
                            <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />

                            <List>
                                {
                                    menuItems.map((item: MenuItem, indexItem: number) => {
                                        return (
                                            <List.Item key={indexItem}>
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={item.icon} style={{ backgroundColor: Colors.Primary }} />}
                                                    title={<span className="fs-5">{item.label}</span>}
                                                    description={
                                                        <>
                                                            {
                                                                item.children && item.children.map((child: MenuItem, indexChild: number) => {
                                                                    const perm = entidad.permisos.filter(reg => reg.menuId === child.menuid).shift();
                                                                    return (
                                                                        <Flex key={indexChild} gap={16} align="center" style={{ marginBottom: 8 }}>
                                                                            <Switch
                                                                                checked={!perm ? false : true}
                                                                                onChange={() => changePermition(child)} />
                                                                            <Space>
                                                                                {child.icon}
                                                                                {child.label}
                                                                            </Space>
                                                                        </Flex>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }
                                                />
                                            </List.Item>
                                        )
                                    })
                                }
                            </List>
                        </Col>
                    </Row>
                </Form>

            </Col >
            <Loading active={procesando} message="Procesando, espere..." />
        </>
    )
}