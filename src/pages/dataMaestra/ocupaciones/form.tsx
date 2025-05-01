import FormModal from '@components/containers/form'
import { useData } from '@hooks/useData'
import { useForm } from '@hooks/useForm'
import { Alerta, Exito } from '@hooks/useMensaje'
import { Ocupacion } from '@interfaces/dataMaestra'
import type { InputRef } from 'antd'
import { Form, Input, Space, Switch } from 'antd'
import { useEffect, useRef } from 'react'

export default function FormOcupaciones() {

    const { contextOcupaciones: { state: { modelo }, agregar, actualizar, cancelar } } = useData()
    const { entidad, editar, handleChangeInput } = useForm<Ocupacion | undefined>(modelo)
    const ref = useRef<InputRef>(null)

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
                Alerta('Situación inesperada tratando de guardar los datos de la ocupación.');
            } else if (!resp.ok) {
                Alerta(resp.mensaje || 'Situación inesperada tratando de guardar los datos de la ocupación.');
            } else {
                Exito(`Ocupación ${esNuevo ? 'registrada' : 'actualizada'}  exitosamente!`);
            }
        }
    }

    useEffect(() => { editar(modelo) }, [modelo])
    useEffect(() => { ref.current!.focus({ cursor: 'start' }) }, [ref])

    if (!entidad) {
        return <></>
    }

    return (
        <FormModal
            name='formOcupaciones'
            title='Ocupaci&oacute;n'
            open={entidad !== null}
            autoComplete='off'
            initialValues={modelo}
            onFinish={guardar}
            onClose={cancelar}>
            <Form.Item name='nombre' label='Nombre' rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input name='nombre' ref={ref} maxLength={150} value={entidad?.nombre || ''} onChange={handleChangeInput} />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Switch
                        id='activo'
                        checked={entidad.activo}
                        onChange={(checked) => editar({ ...entidad, activo: checked })} />
                    <span>Activo</span>
                </Space>
            </Form.Item>
        </FormModal>
    )
}