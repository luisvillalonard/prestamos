import FormModal from "@components/containers/form"
import InputEmail from "@components/inputs/email"
import InputText from "@components/inputs/text"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Usuario } from "@interfaces/seguridad"
import { Form, Input } from "antd"
import { useEffect } from "react"

export default function FormUsuario() {

    const { contextUsuarios: { state: { modelo }, agregar, actualizar, cancelar } } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Usuario | undefined>(modelo)

    const guardar = async () => {

        if (entidad) {

            let resp;
            const esNuevo = entidad.id === 0;
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

    useEffect(() => { editar(modelo); console.log('modelo', modelo) }, [modelo])

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
            <InputText name="acceso" label="Acceso" maxLength={100} value={entidad?.acceso || ''}
                rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
                
            <InputText name="empleadoId" label="Empleado Id" maxLength={100} value={entidad?.empleadoId || ''}
                rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />

            <InputEmail name="correo" label="Correo Electr&oacute;nico" maxLength={100} value={entidad?.correo || ''}
                rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />

        </FormModal>
    )
}