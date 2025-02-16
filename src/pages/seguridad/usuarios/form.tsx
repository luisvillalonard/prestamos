import FormModal from "@components/containers/form"
import InputEmail from "@components/inputs/email"
import InputText from "@components/inputs/text"
import RadioSwitch from "@components/radios/swich"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Usuario } from "@interfaces/seguridad"
import { useEffect } from "react"

export default function FormUsuario() {

    const { contextUsuarios: { state: { modelo }, agregar, actualizar, cancelar } } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Usuario | undefined>(modelo)
    const esNuevo = entidad?.id === 0;

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
                Alerta('Situación inesperada tratando de guardar los datos del usuario.');
            } else {
                Exito(`Usuario ${esNuevo ? 'registrado' : 'actualizado'}  exitosamente!`);
            }
        }
    }

    useEffect(() => { editar(modelo) }, [modelo])

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
            <InputText name="acceso" label="Acceso" maxLength={25} value={entidad?.acceso || ''} disabled={!esNuevo}
                rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />

            <InputText name="empleadoId" label="Empleado Id" maxLength={50} value={entidad?.empleadoId || ''}
                rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />

            <InputEmail name="correo" label="Correo Electr&oacute;nico" maxLength={150} value={entidad?.correo || ''}
                rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />

            {
                esNuevo
                    ? <></>
                    : <RadioSwitch id="usuarioCambio" label="Cambio la clave" checked={entidad.cambio}
                        onChange={(checked) => editar({ ...entidad, cambio: checked })} />
            }

            {
                esNuevo
                    ? <></>
                    : <RadioSwitch id="usuarioActivo" label={entidad.activo ? 'Activo' : 'Inactivo'} checked={entidad.activo}
                        onChange={(checked) => editar({ ...entidad, activo: checked })} />
            }

        </FormModal>
    )
}