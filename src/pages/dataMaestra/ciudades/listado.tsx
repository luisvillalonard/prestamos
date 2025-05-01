import { ButtonEdit } from "@components/buttons/edit"
import { TagDanger, TagSuccess } from "@components/tags/tags"
import { useData } from "@hooks/useData"
import { Ciudad } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { Flex, Table, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { filter = '' } = props
    const { contextCiudades: { state, editar, todos } } = useData()
    const { datos, procesando, recargar } = state
    const url = useLocation()

    const cargar = async () => await todos();

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<Ciudad>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            dataSource={
                procesando
                    ? []
                    : datos
                        .filter(item => item.nombre.toLowerCase().indexOf(filter) >= 0)
                        .map((item, index) => { return { ...item, key: index + 1 } })
            } locale={{ emptyText: <Flex>0 ciudades</Flex> }}>
            <Table.Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Table.Column title="Nombre" dataIndex="nombre" key="nombre" />
            <Table.Column title="Estado" align="center" render={(record: Ciudad) => (
                record.activo ? <TagSuccess text="Activa" /> : <TagDanger text="Inactiva" />
            )} />
            <Table.Column title="Acci&oacute;n" align="center" width={80} render={(record: Ciudad) => (
                <Tooltip title={`Editar la ciudad (${record.nombre})`}>
                    <ButtonEdit type="text" onClick={() => { editar(record) }} />
                </Tooltip>
            )} />
        </Table>
    )
}
