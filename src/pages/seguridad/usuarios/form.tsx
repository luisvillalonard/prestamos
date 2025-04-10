import FormModal from "@components/containers/form"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Usuario } from "@interfaces/seguridad"
import { Form, Input, Select, Space, Switch } from "antd"
import { useEffect } from "react"

export default function FormUsuario() {

    const {
        contextUsuarios: { state: { modelo }, agregar, actualizar, cancelar },
        contextPermisos: { state: { datos: roles }, todos }
    } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Usuario | undefined>(modelo)
    const esNuevo = entidad?.id === 0;

    const cargarRoles = async () => await todos()

    const guardar = async () => {

        if (entidad) {

            let resp;
            if (esNuevo) {
                resp = await agregar(entidad);
            } else {
                resp = await actualizar(entidad);
            }

            if (!resp) {
                Alerta('Situación inesperada tratando de guardar los datos del usuario.');
            } else if (!resp.ok) {
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del usuario.');
            } else {
                Exito(`Usuario ${esNuevo ? 'registrado' : 'actualizado'}  exitosamente!`);
            }
        }
    }

    useEffect(() => {
        editar(modelo);
        cargarRoles();
    }, [modelo])

    if (!entidad) {
        return <></>
    }

    return (
        <FormModal
            name="formUsuario"
            title="Usuario"
            open={entidad !== null}
            autoComplete="off"
            initialValues={modelo}
            onFinish={guardar}
            onClose={cancelar}>
            <Form.Item name="acceso" label="Acceso" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input name="acceso" maxLength={25} value={entidad?.acceso || ''} disabled={!esNuevo} onChange={handleChangeInput} />
            </Form.Item>
            <Form.Item name="empleadoId" label="Empleado C&oacute;digo">
                <Input name="empleadoId" maxLength={50} value={entidad?.empleadoId || ''} onChange={handleChangeInput} />
            </Form.Item>
            <Form.Item name="correo" label="Correo Electr&oacute;nico" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input type="email" name="correo" maxLength={150} value={entidad?.correo || ''} onChange={handleChangeInput} />
            </Form.Item>
            <Form.Item label="Perf&iacute;l de Usuario">
                <Select
                    allowClear
                    defaultValue={entidad?.rol?.id}
                    options={roles.map(item => ({ key: item.id, value: item.id, label: item.nombre }))}
                    onChange={(value: number) => {
                        if (entidad) {
                            editar({ ...entidad, rol: roles.filter(opt => opt.id === value).shift() });
                        }
                    }} />
            </Form.Item>
            {
                esNuevo
                    ? <></>
                    :
                    <Form.Item>
                        <Space>
                            <Switch
                                id="cambioClave"
                                checked={entidad.cambio}
                                onChange={(checked) => editar({ ...entidad, cambio: checked })} />
                            <span>Esta usuario cambio su clave de acceso</span>
                        </Space>
                    </Form.Item>
            }
            {
                esNuevo
                    ? <></>
                    :
                    <Form.Item>
                        <Space>
                            <Switch
                                id="usuarioActivo"
                                checked={entidad.activo}
                                onChange={(checked) => editar({ ...entidad, activo: checked })} />
                            <span>{entidad.activo ? 'Activo' : 'Inactivo'}</span>
                        </Space>
                    </Form.Item>
            }
        </FormModal>
    )
}