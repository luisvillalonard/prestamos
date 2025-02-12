import FormModal from "@components/containers/form"
import InputText from "@components/inputs/text"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { MetodoPago } from "@interfaces/dataMaestra"
import { useEffect } from "react"

export default function FormMetodoPago() {

    const { contextMetodosPago: { state: { modelo }, agregar, actualizar, cancelar } } = useData()
    const { entidad, editar, handleChangeInput } = useForm<MetodoPago | undefined>(modelo)

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

    useEffect(() => { editar(modelo) }, [modelo])

    if (!entidad) {
        return <></>
    }

    return (
        <FormModal
            name="formMetodoPago"
            title="M&eacute;todo de Pago"
            open={entidad !== null}
            autoComplete="off"
            initialValues={modelo}
            onFinish={guardar}
            onClose={cancelar}>
            <InputText name="nombre" label="Nombre" maxLength={100} value={entidad?.nombre || ''}
                rules={[{ required: true, message: 'Obligatorio' }]} onChange={handleChangeInput} />
        </FormModal>
    )
}