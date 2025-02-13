import { ButtonEdit } from "@components/buttons/edit"
import { useData } from "@hooks/useData"
import { Cliente } from "@interfaces/clientes"
import { ControlProps } from "@interfaces/globales"
import { Flex, Table, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextClientes: { state, editar, todos } } = useData()
    const { datos, procesando, recargar } = state
    const { filter = '' } = props
    const url = useLocation()
    const { Column } = Table

    const cargar = async () => await todos();

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<Cliente>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            dataSource={
                procesando
                    ? []
                    :
                    datos
                        .filter(item => {
                            return (
                                item.nombres.toLowerCase().indexOf(filter) >= 0 ||
                                item.apellidos.toLowerCase().indexOf(filter) >= 0 ||
                                item.codigo.toLowerCase().indexOf(filter) >= 0 ||
                                (item.documento?.nombre || '').toLowerCase().indexOf(filter) >= 0 ||
                                (item.empleadoId || '').indexOf(filter) >= 0 ||
                                (item.telefonoCelular || '').indexOf(filter) >= 0
                            )
                        })
                        .map((item, index) => { return { ...item, key: index + 1 } })
            } locale={{ emptyText: <Flex>0 clientes</Flex> }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Código" dataIndex="codigo" key="codigo" />
            <Column title="Empleado Id" dataIndex="empleadoId" key="empleadoId" />
            <Column title="Nombres y Apellidos" render={(record: Cliente) => (`${record.nombres} ${record.apellidos}`.trim())} />
            <Column title="DNI" render={(record: Cliente) => (record.documento?.nombre)} />
            <Column title="Sexo" dataIndex="sexo" key="sexo" />
            <Column title="Ciudad" dataIndex="ciudad" key="ciudad" />
            <Column title="Ocupaci&oacute;n" dataIndex="ocupacion" key="ocupacion" />
            <Column title="Tel&eacute;fono Celular" render={(record: Cliente) => (record.telefonoCelular)} />
            {/* <Column title="Estado" render={(record: Cliente) => (
                <Tag color={record.activo ? '#87d068' : 'red'}>{record.activo ? 'Activo' : 'Inactivo'}</Tag>
            )} /> */}
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: Cliente) => (
                <Tooltip title={`Editar el cliente (${record.nombres} ${record.apellidos})`.trim()}>
                    <ButtonEdit type="text" onClick={() => { editar(record) }} />
                </Tooltip>
            )} />
        </Table>
    )

}