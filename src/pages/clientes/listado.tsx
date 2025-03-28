import { ButtonEdit } from "@components/buttons/edit"
import { TagDanger, TagSuccess } from "@components/tags/tags"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Cliente } from "@interfaces/clientes"
import { ControlProps } from "@interfaces/globales"
import { Flex, Table, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextClientes: { state: { datos, procesando, recargar }, editar, todos } } = useData()
    const { filter = '' } = props
    const nav = useNavigate()
    const url = useLocation()
    const { Column } = Table

    const cargar = async () => await todos();

    const onEdit = (cliente: Cliente) => {
        editar(cliente);
        nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, { replace: true });
    }

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
            }
            locale={{ emptyText: <Flex>0 clientes</Flex> }}
            scroll={{ x: 'max-content' }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Código" dataIndex="codigo" key="codigo" fixed='left' width={80} />
            <Column title="Empleado Id" dataIndex="empleadoId" key="empleadoId" width={100} />
            <Column title="Nombres y Apellidos" width={180} render={(record: Cliente) => (
                `${record.nombres || ''} ${record.apellidos || ''}`.trim()
            )} />
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
                record.activo ? <TagSuccess text="Activo" /> : <TagDanger text="Inactivo" />
            )} />
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: Cliente) => (
                <Tooltip title={`Editar el cliente (${record.nombres} ${record.apellidos})`.trim()}>
                    <ButtonEdit type="text" onClick={() => onEdit(record)} />
                </Tooltip>
            )} />
        </Table>
    )

}