import { ButtonEdit } from "@components/buttons/edit"
import { TagDanger, TagSuccess } from "@components/tags/tags"
import { useData } from "@hooks/useData"
import { FormaPago } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { Flex, Table, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextFormasPago: { state, editar, todos } } = useData()
    const { datos, procesando, recargar } = state
    const { filter } = props
    const url = useLocation()
    const { Column } = Table

    const cargar = async () => await todos();

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<FormaPago>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            dataSource={
                procesando
                    ? []
                    : datos
                        .filter(item => item.nombre.toLowerCase().indexOf(filter ?? '') >= 0)
                        .map((item, index) => { return { ...item, key: index + 1 } })
            } locale={{ emptyText: <Flex>0 formas de pago</Flex> }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Nombre" dataIndex="nombre" key="nombre" />
            <Column title="Estado" align="center" render={(record: FormaPago) => (
                record.activo ? <TagSuccess text="Activa" /> : <TagDanger text="Inactiva" />
            )} />
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: FormaPago) => (
                <Tooltip title={`Editar la forma de pago (${record.nombre})`}>
                    <ButtonEdit type="text" onClick={() => { editar(record) }} />
                </Tooltip>
            )} />
        </Table>
    )
}
