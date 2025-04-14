import FormModal from "@components/containers/form"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Ciudad } from "@interfaces/dataMaestra"
import { Form, Input, Space, Switch } from "antd"
import { useEffect } from "react"

export default function FormCiudades() {

    const { contextCiudades: { state: { modelo }, agregar, actualizar, cancelar } } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Ciudad | undefined>(modelo)

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
                Alerta('Situación inesperada tratando de guardar los datos de la ciudad.');
            } else if (!resp.ok) {
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos de la ciudad.');
            } else {
                Exito(`Ciudad ${esNuevo ? 'registrada' : 'actualizada'}  exitosamente!`);
            }
        }
    }

    useEffect(() => { editar(modelo) }, [modelo])

    if (!entidad) {
        return <></>
    }

    return (
        <FormModal
            name="formCiudades"
            title="Ciudad"
            open={entidad !== null}
            autoComplete="off"
            initialValues={modelo}
            onFinish={guardar}
            onClose={cancelar}>
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input name="nombre" maxLength={150} value={entidad?.nombre || ''} onChange={handleChangeInput} />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Switch
                        id="activo"
                        checked={entidad.activo}
                        onChange={(checked) => editar({ ...entidad, activo: checked })} />
                    <span>Activo</span>
                </Space>
            </Form.Item>
        </FormModal>
    )
}