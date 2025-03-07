import FormModal from "@components/containers/form"
import FormItem from "@components/forms/item"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { PrestamoEstado } from "@interfaces/dataMaestra"
import { Input, Space, Switch } from "antd"
import { useEffect } from "react"

export default function FormPrestamoEstado() {

    const { contextPrestamosEstados: { state: { modelo }, agregar, actualizar, cancelar } } = useData()
    const { entidad, editar, handleChangeInput } = useForm<PrestamoEstado | undefined>(modelo)

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
                Alerta('Situación inesperada tratando de guardar los datos del estado de préstamo.');
            } else if (!resp.ok) {
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos del estado de préstamo.');
            } else {
                Exito(`Estado de préstamo ${esNuevo ? 'registrada' : 'actualizada'}  exitosamente!`);
            }
        }
    }

    useEffect(() => { editar(modelo) }, [modelo])

    if (!entidad) {
        return <></>
    }

    return (
        <FormModal
            name="formPrestamoEstado"
            title="Estado de Prestamo"
            open={entidad !== null}
            autoComplete="off"
            initialValues={modelo}
            onFinish={guardar}
            onClose={cancelar}>
            <FormItem name="nombre" label="Nombre" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input name="nombre" maxLength={150} value={entidad?.nombre || ''} onChange={handleChangeInput} />
            </FormItem>
            <FormItem>
                <Space>
                    <Switch
                        checked={entidad?.inicial}
                        onChange={(value) => {
                            if (entidad) {
                                editar({ ...entidad, inicial: value })
                            }
                        }} />
                    <span>Este estado ser&aacute; con el que se cree el prestamo.</span>
                </Space>
            </FormItem>
            <FormItem>
                <Space>
                    <Switch
                        checked={entidad?.final}
                        onChange={(value) => {
                            if (entidad) {
                                editar({ ...entidad, final: value })
                            }
                        }} />
                    <span>Este ser&aacute; el estado con el que se cierre el prestamo, luego de este no existir&aacute; otro estado</span>
                </Space>
            </FormItem>
        </FormModal>
    )
}