import { ButtonEdit } from "@components/buttons/edit"
import { useConstants } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Cliente } from "@interfaces/clientes"
import { ControlProps } from "@interfaces/globales"
import { Flex, Table, Tag, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextClientes: { state: { datos, procesando, recargar }, editar, todos } } = useData()
    const { filter = '' } = props
    const url = useLocation()
    useConstants()
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
                                (item.documento || '').toLowerCase().indexOf(filter) >= 0 ||
                                (item.empleadoId || '').indexOf(filter) >= 0 ||
                                (item.telefonoCelular || '').indexOf(filter) >= 0
                            )
                        })
                        .map((item, index) => { return { ...item, key: index + 1 } })
            } locale={{ emptyText: <Flex>0 clientes</Flex> }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Código" dataIndex="codigo" key="codigo" width={80} />
            <Column title="Empleado Id" dataIndex="empleadoId" key="empleadoId" width={100} />
            <Column title="Nombres y Apellidos" width={180} render={(record: Cliente) => (`${record.nombres} ${record.apellidos}`.trim())} />
            <Column title="Documento" render={(record: Cliente) => (
                <span style={{ textWrap: 'nowrap' }}>{`(${record.documentoTipo?.nombre}) ${record.documento}`}</span>
            )} />
            <Column title="Sexo" render={(record: Cliente) => (record.sexo?.nombre)} />
            <Column title="Ciudad" render={(record: Cliente) => (record.ciudad?.nombre)} />
            <Column title="Ocupaci&oacute;n" render={(record: Cliente) => (record.ocupacion?.nombre)} />
            <Column title="Celular" render={(record: Cliente) => (
                <span style={{ textWrap: 'nowrap' }}>{record.telefonoCelular}</span>
            )} />
            <Column title="Estado" render={(record: Cliente) => (
                <Tag color={record.activo ? '#87d068' : 'red'}>{record.activo ? 'Activo' : 'Inactivo'}</Tag>
            )} />
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: Cliente) => (
                <Tooltip title={`Editar el cliente (${record.nombres} ${record.apellidos})`.trim()}>
                    <ButtonEdit type="text" onClick={() => editar(record)} />
                </Tooltip>
            )} />
        </Table>
    )

}