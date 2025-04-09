import { Colors, Urls } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { IconPayMoney } from "@hooks/useIconos"
import { FormatNumber } from "@hooks/useUtils"
import { ControlProps } from "@interfaces/globales"
import { Prestamo, PrestamoCuota } from "@interfaces/prestamos"
import { Button, Flex, Table, Tag, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextPrestamos: { state, todos } } = useData()
    const { datos, procesando, recargar } = state
    const { filter = '' } = props
    const url = useLocation()
    const nav = useNavigate()

    const cargar = async () => await todos();

    const montoPendiente = (cuotas: PrestamoCuota[]): number => {

        cuotas.filter(cuota => !cuota.pagado)

        const total = cuotas
            .reduce((acc, item) => {
                return acc + item.pagos.reduce((accP, itemP) => { return accP + itemP.monto }, 0)
            }, 0)

        return Math.round(total)
    }

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<Prestamo>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            locale={{ emptyText: <Flex>0 prestamos</Flex> }}
            dataSource={
                procesando
                    ? []
                    :
                    datos
                        .filter(item => {
                            return (
                                item.codigo.toLowerCase().indexOf(filter) >= 0 ||
                                (item.cliente?.codigo || '').toString().indexOf(filter) >= 0 ||
                                (item.cliente?.nombres || '').toString().indexOf(filter) >= 0 ||
                                (item.cliente?.apellidos || '').toString().indexOf(filter) >= 0
                            )
                        })
                        .map((item, index) => { return { ...item, key: index + 1 } })
            }>
            <Table.Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Table.Column title="Código" dataIndex="codigo" key="codigo" />
            <Table.Column title="Fecha Cr&eacute;dito" render={(record: Prestamo) => (record.fechaCredito)} />
            <Table.Column title="Cliente" render={(record: Prestamo) => (`${record.cliente?.nombres} ${record.cliente?.apellidos}`.trim())} />
            <Table.Column title="Monto" render={(record: Prestamo) => (FormatNumber(record.deudaInicial, 2))} />
            <Table.Column title="Capital" render={(record: Prestamo) => (FormatNumber(Math.round(record.cuotas.reduce((acc, item) => { return acc + item.capital }, 0)), 2))} />
            <Table.Column title="Inter&eacute;s" render={(record: Prestamo) => (FormatNumber(Math.round(record.cuotas.reduce((acc, item) => { return acc + item.interes }, 0)), 2))} />
            <Table.Column title="Pendiente" render={(record: Prestamo) => (
                FormatNumber(record.deudaInicial - montoPendiente(record.cuotas), 2)
            )} />
            <Table.Column title="Estado" align="center" render={(record: Prestamo) => (
                <Tag
                    color={record.estado?.inicial ? '' : record.estado?.final ? 'blue' : Colors.Success}
                    style={{ fontWeight: 600, borderRadius: 10 }}>
                    {record.estado?.nombre}
                </Tag>
            )} />
            <Table.Column title="Acci&oacute;n" align="center" width={80} render={(record: Prestamo) => (
                <Tooltip title={`Editar el prestamo (${record.codigo})`}>
                    <Button shape="round" icon={<IconPayMoney color="primary" />} onClick={() => {
                        nav(`/${Urls.Prestamos.Base}/${Urls.Prestamos.Cobro.replace(':id?', record.id.toString())}`, { replace: true })
                    }}>Pagar</Button>
                </Tooltip>
            )} />
        </Table>
    )

}