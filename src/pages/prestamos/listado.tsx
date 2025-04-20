import { ButtonDefault } from "@components/buttons/default"
import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { IconEdit, IconPayMoney } from "@hooks/useIconos"
import { FormatNumber } from "@hooks/useUtils"
import { ControlProps } from "@interfaces/globales"
import { VwPrestamo } from "@interfaces/prestamos"
import { Button, Flex, Space, Table, Tag, Tooltip } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { filter = '' } = props
    const { contextPrestamos: { state: { recargar, paginacion }, todos } } = useData()
    const [datos, setDatos] = useState<VwPrestamo[]>([])
    const url = useLocation()
    const nav = useNavigate()

    const cargar = async () => {

        const result = await todos(paginacion);
        if (result) {
            setDatos(result.datos ?? [])
        }
    };

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<VwPrestamo>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            locale={{ emptyText: <Flex>0 prestamos</Flex> }}
            scroll={{ x: 1300 }}
            dataSource={datos && datos.filter(item => {
                return (
                    item.codigo.toLowerCase().indexOf(filter) >= 0 ||
                    (item.cliente || '').toString().indexOf(filter) >= 0 ||
                    (item.clienteCodigo || '').toString().indexOf(filter) >= 0 ||
                    (item.clienteDocumento || '').toString().indexOf(filter) >= 0
                )
            }).map((item, index) => { return { ...item, key: index + 1 } })
            }>
            <Table.Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Table.Column title="Código" dataIndex="codigo" key="codigo" />
            <Table.Column title="Fecha Cr&eacute;dito" render={(record: VwPrestamo) => (record.fechaCredito)} />
            <Table.Column title="Cliente" render={(record: VwPrestamo) => (record.cliente)} />
            <Table.Column title="Monto" render={(record: VwPrestamo) => (FormatNumber(record.monto, 2))} />
            <Table.Column title="Inter&eacute;s" render={(record: VwPrestamo) => (FormatNumber(record.interes, 2))} />
            <Table.Column title="Pendiente" render={(record: VwPrestamo) => (FormatNumber(record.pendiente, 2))} />
            <Table.Column title="Estado" render={(record: VwPrestamo) => (
                <Tag
                    color={
                        record.cancelado
                            ? Colors.Danger
                            : !record.activo
                                ? Colors.Success
                                : record.pendiente > 0
                                    ? ''
                                    : ''
                    }
                    style={{ fontWeight: 600, borderRadius: 10 }}>
                    {record.estado}
                </Tag>
            )} />
            <Table.Column title="Acci&oacute;n" align="center" width={225} render={(record: VwPrestamo) => (
                record.cancelado || !record.activo
                    ? <></>
                    :
                    <Space>
                        <ButtonDefault shape="round" icon={<IconEdit />} onClick={() => {
                            nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Editar.replace(':id?', record.id.toString())}`, { replace: true })
                        }}>
                            Editar
                        </ButtonDefault>
                        <Tooltip title={`Editar el prestamo (${record.codigo})`}>
                            <Button shape="round" icon={<IconPayMoney color="primary" />} onClick={() => {
                                nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Cobro.replace(':id?', record.id.toString())}`, { replace: true })
                            }}>
                                Pagar
                            </Button>
                        </Tooltip>
                    </Space>
            )} />
        </Table>
    )

}