import FormModal from "@components/containers/form"
import { useData } from "@hooks/useData"
import { useForm } from "@hooks/useForm"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormaPago, FormaPagoFecha } from "@interfaces/dataMaestra"
import { Form, Input, Select } from "antd"
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
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input name="nombre" maxLength={150} value={entidad?.nombre || ''} onChange={handleChangeInput} />
            </Form.Item>
            <Form.Item label="D&iacute;as" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="seleccione los d&iacute;as"
                    defaultValue={entidad.dias.map(item => item.dia)}
                    onChange={(valores: number[]) => {
                        editar({
                            ...entidad,
                            dias: valores.map(valor => ({
                                formaPagoId: entidad.id,
                                dia: valor,
                            } as FormaPagoFecha))
                        })
                    }}
                    options={Array.from(Array(31).keys()).map((dia) => ({ key: dia, value: dia + 1, label: dia + 1 }))}
                />
            </Form.Item>
        </FormModal>
    )
}