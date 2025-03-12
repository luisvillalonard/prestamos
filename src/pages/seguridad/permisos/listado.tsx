import { ButtonEdit } from "@components/buttons/edit"
import { TagDanger, TagDefault, TagSuccess } from "@components/tags/tags"
import { Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { ControlProps } from "@interfaces/globales"
import { Rol } from "@interfaces/seguridad"
import { Flex, Table, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextPermisos: { state: { datos, procesando, recargar }, editar, todos } } = useData()
    const { filter = '' } = props
    const nav = useNavigate()
    const url = useLocation()
    const { Column } = Table

    const cargar = async () => await todos();

    const onEdit = (rol: Rol) => {
        editar(rol);
        nav(`/${Urls.Seguridad.Base}/${Urls.Seguridad.PermisosFormulario}`, { replace: true });
    }

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<Rol>
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
                                item.nombre.toLowerCase().indexOf(filter) >= 0 ||
                                (item.descripcion || '').toLowerCase().indexOf(filter) >= 0
                            )
                        })
                        .map((item, index) => { return { ...item, key: index + 1 } })
            }
            locale={{ emptyText: <Flex>0 clientes</Flex> }}
            scroll={{ x: 'max-content' }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Código" dataIndex="nombre" key="nombre" />
            <Column title="Descripci&oacute;n" dataIndex="descripcion" key="descripcion" />
            <Column title="Es Administrador" align="center" render={(record: Rol) => (
                record.esAdmin ? <TagSuccess text="Si" /> : <TagDanger text="No" />
            )} />
            <Column title="Estado" align="center" render={(record: Rol) => (
                record.activo ? <TagSuccess text="Activo" /> : <TagDefault text="Inactivo" />
            )} />
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: Rol) => (
                <Tooltip title={`Editar el perfíl de usuario (${record.nombre})`}>
                    <ButtonEdit type="text" onClick={() => onEdit(record)} />
                </Tooltip>
            )} />
        </Table>
    )

}