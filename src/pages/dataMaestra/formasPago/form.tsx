import FormModal from "@components/containers/form"
import InputText from "@components/inputs/text"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormaPago } from "@interfaces/dataMaestra"
import { useEffect } from "react"

export default function FormFormaPago() {

    const { contextFormasPago: { state: { modelo }, agregar, actualizar, cancelar } } = useData()
    const { entidad, editar, handleChangeInput } = useForm<FormaPago | undefined>(modelo)

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
                Alerta('Situación inesperada tratando de guardar los datos de la forma de pago.');
            } else if (!resp.ok) {
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos de la forma de pago.');
            } else {
                Exito(`Forma de pago ${esNuevo ? 'registrada' : 'actualizada'}  exitosamente!`);
            }
        }
    }

    useEffect(() => { editar(modelo) }, [modelo])

    if (!entidad) {
        return <></>
    }

    return (
        <FormModal
            name="formFormaPago"
            title="Forma de Pago"
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