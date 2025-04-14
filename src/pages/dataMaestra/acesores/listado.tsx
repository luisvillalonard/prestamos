import { ButtonEdit } from "@components/buttons/edit"
import { TagDanger, TagSuccess } from "@components/tags/tags"
import { useData } from "@hooks/useData"
import { Acesor } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { Flex, Table, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextAcesores: { state, editar, todos } } = useData()
    const { datos, recargar } = state
    const { filter } = props
    const url = useLocation()
    const { Column } = Table

    const cargar = async () => await todos();

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<Acesor>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            dataSource={
                datos
                    .filter(item => item.nombre.toLowerCase().indexOf(filter ?? '') >= 0)
                    .map((item, index) => { return { ...item, key: index + 1 } })
            }
            locale={{ emptyText: <Flex>0 acesores</Flex> }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Nombre" dataIndex="nombre" key="nombre" />
            <Column title="Estado" align="center" render={(record: Acesor) => (
                record.activo ? <TagSuccess text="Activo" /> : <TagDanger text="Inactivo" />
            )} />
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: Acesor) => (
                <Tooltip title={`Editar el acesor (${record.nombre})`}>
                    <ButtonEdit type="text" onClick={() => { editar(record) }} />
                </Tooltip>
            )} />
        </Table>
    )
}
