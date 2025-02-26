import { ButtonEdit } from "@components/buttons/edit";
import { useData } from "@hooks/useData";
import { ControlProps } from "@interfaces/globales";
import { Usuario } from "@interfaces/seguridad";
import { Flex, Table, Tag, Tooltip } from "antd";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextUsuarios: { state, editar, todos } } = useData()
    const { datos, procesando, recargar } = state
    const { filter } = props
    const url = useLocation()
    const { Column } = Table

    const cargar = async () => await todos();

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<Usuario>
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
                                item.acceso.toLowerCase().indexOf(filter ?? '') >= 0 ||
                                (item.empleadoId || '').indexOf(filter ?? '') >= 0 ||
                                (item.correo || '').indexOf(filter ?? '') >= 0
                            )
                        })
                        .map((item, index) => { return { ...item, key: index + 1 } })
            } locale={{ emptyText: <Flex>0 usuarios</Flex> }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Acceso" dataIndex="acceso" key="acceso" />
            <Column title="Perf&iacute;l" render={(record: Usuario) => (record.rol?.nombre)} />
            <Column title="C&oacute;digo Empleado" render={(record: Usuario) => (record.empleadoId)} />
            <Column title="Correo" dataIndex="correo" key="correo" />
            <Column title="Cambio Clave" render={(record: Usuario) => (
                <Tag color={record.cambio ? '#87d068' : 'red'}>{record.cambio ? 'Si' : 'No'}</Tag>
            )} />
            <Column title="Estado" render={(record: Usuario) => (
                <Tag color={record.activo ? '#87d068' : 'red'}>{record.activo ? 'Activo' : 'Inactivo'}</Tag>
            )} />
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: Usuario) => (
                <Tooltip title={`Editar el usuario (${record.acceso})`}>
                    <ButtonEdit type="text" onClick={() => { editar(record) }} />
                </Tooltip>
            )} />
        </Table>
    )
}
