import { ButtonEdit } from '@components/buttons/edit'
import { TagDanger, TagSuccess } from '@components/tags/tags'
import { useData } from '@hooks/useData'
import { Cliente, VwCliente } from '@interfaces/clientes'
import { ControlProps, RequestFilter } from '@interfaces/globales'
import { Flex, Table, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Listado(props: Pick<ControlProps, 'filter' | 'onClick'> & {
    soloActivos?: boolean,
}) {

    const { filter = '', soloActivos, onClick } = props
    const { contextClientes: { state: { recargar, paginacion }, todos, activos } } = useData()
    const [datos, setDatos] = useState<VwCliente[]>([])
    const url = useLocation()

    const cargar = async () => {

        const request: RequestFilter = {
            pageSize: paginacion?.pageSize ?? 10,
            currentPage: paginacion?.currentPage ?? 1,
            filter: filter,
        }
        const result = soloActivos ? await activos(request) : await todos(request);
        if (result) {
            setDatos(result.datos ?? [])
        }
    };


    useEffect(() => { cargar() }, [url.pathname, filter])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<VwCliente>
            size='middle'
            bordered={false}
            pagination={{ size: 'default', responsive: true, current: paginacion?.currentPage ?? 1, total: paginacion?.pageSize ?? 10 }}
            dataSource={datos && datos.map((item, index) => { return { ...item, key: index + 1 } })
            }
            locale={{ emptyText: <Flex>0 clientes</Flex> }}
            scroll={{ x: 'max-content' }}>
            <Table.Column title='#' dataIndex='key' key='key' align='center' fixed='left' width={60} />
            <Table.Column title='Código' dataIndex='codigo' key='codigo' fixed='left' width={80} />
            <Table.Column title='Empleado Id' dataIndex='empleadoId' key='empleadoId' fixed='left' width={100} />
            <Table.Column title='Nombres y Apellidos' render={(record: VwCliente) => (record.nombreCompleto)} />
            <Table.Column title='Tipo Documento' render={(record: VwCliente) => (record.documentoTipo)} />
            <Table.Column title='Documento' render={(record: VwCliente) => (record.documento)} />
            <Table.Column title='Sexo' render={(record: VwCliente) => (record.sexo)} />
            <Table.Column title='Ciudad' render={(record: VwCliente) => (record.ciudad)} />
            <Table.Column title='Ocupaci&oacute;n' render={(record: VwCliente) => (record.ocupacion)} />
            <Table.Column title='Celular' render={(record: VwCliente) => (
                <span style={{ textWrap: 'nowrap' }}>{record.telefonoCelular}</span>
            )} />
            <Table.Column title='Estado' render={(record: VwCliente) => (
                record.activo ? <TagSuccess text='Activo' /> : <TagDanger text='Inactivo' />
            )} />
            <Table.Column title='Acci&oacute;n' align='center' width={80} render={(record: Cliente) => (
                <Tooltip title={`Editar el cliente (${record.nombres} ${record.apellidos})`.trim()}>
                    <ButtonEdit type='text' onClick={() => onClick?.(record)} />
                </Tooltip>
            )} />
        </Table>
    )

}