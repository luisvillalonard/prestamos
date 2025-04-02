import { ButtonEdit } from "@components/buttons/edit"
import { TagDanger, TagSuccess } from "@components/tags/tags"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { Cliente } from "@interfaces/clientes"
import { Flex, Table, Tooltip } from "antd"
import { useNavigate } from "react-router-dom"

export default function Listado() {

    const { contextClientes: { state: { datos, procesando, paginacion }, editar } } = useData()
    const nav = useNavigate()

    const onEdit = (cliente: Cliente) => {
        editar(cliente);
        nav(`/${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, { replace: true });
    }

    return (
        <Table<Cliente>
            size="middle"
            bordered={false}
            pagination={{ size: 'default', responsive: true, current: paginacion?.currentPage?? 1, total: paginacion?.pageSize ?? 10 }}
            dataSource={
                procesando
                    ? []
                    :
                    datos.map((item, index) => { return { ...item, key: index + 1 } })
            }
            locale={{ emptyText: <Flex>0 clientes</Flex> }}
            scroll={{ x: 'max-content' }}>
            <Table.Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Table.Column title="Código" dataIndex="codigo" key="codigo" fixed='left' width={80} />
            <Table.Column title="Empleado Id" dataIndex="empleadoId" key="empleadoId" width={100} />
            <Table.Column title="Nombres y Apellidos" width={180} render={(record: Cliente) => (
                `${record.nombres || ''} ${record.apellidos || ''}`.trim()
            )} />
            <Table.Column title="Documento" render={(record: Cliente) => (
                <span style={{ textWrap: 'nowrap' }}>{`(${record.documentoTipo?.nombre}) ${record.documento}`}</span>
            )} />
            <Table.Column title="Sexo" render={(record: Cliente) => (record.sexo?.nombre)} />
            <Table.Column title="Ciudad" render={(record: Cliente) => (record.ciudad?.nombre)} />
            <Table.Column title="Ocupaci&oacute;n" render={(record: Cliente) => (record.ocupacion?.nombre)} />
            <Table.Column title="Celular" render={(record: Cliente) => (
                <span style={{ textWrap: 'nowrap' }}>{record.telefonoCelular}</span>
            )} />
            <Table.Column title="Estado" render={(record: Cliente) => (
                record.activo ? <TagSuccess text="Activo" /> : <TagDanger text="Inactivo" />
            )} />
            <Table.Column title="Acci&oacute;n" align="center" width={80} render={(record: Cliente) => (
                <Tooltip title={`Editar el cliente (${record.nombres} ${record.apellidos})`.trim()}>
                    <ButtonEdit type="text" onClick={() => onEdit(record)} />
                </Tooltip>
            )} />
        </Table>
    )

}