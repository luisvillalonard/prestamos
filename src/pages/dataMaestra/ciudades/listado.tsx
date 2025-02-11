import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useData } from "@hooks/useData"
import { useIconos } from "@hooks/useIconos"
import { Ciudad } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { Button, Flex, Table, Tooltip } from "antd"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextCiudades: { state, editar, todos } } = useData()
    const { datos, procesando, recargar } = state
    const { filter } = props
    const url = useLocation()
    const { IconEdit } = useIconos()
    const { Column } = Table

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
                        .filter(item => item.nombre.toLowerCase().indexOf(filter ?? '') >= 0)
                        .map((item, index) => { return { ...item, key: index + 1 } })
            } locale={{ emptyText: <Flex>0 usuarios</Flex> }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Nombre" dataIndex="nombre" key="nombre" />
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: Ciudad) => (
                <Tooltip title={`Editar la ciudad (${record.nombre})`}>
                    <Button type="text" icon={<IconEdit />} onClick={() => { editar(record) }} />
                </Tooltip>
            )} />
        </Table>
    )
}
