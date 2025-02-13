import { ButtonEdit } from "@components/buttons/edit"
import { useData } from "@hooks/useData"
import { Prestamo } from "@interfaces/prestamos"
import { ControlProps } from "@interfaces/globales"
import { Flex, Table, Tag, Tooltip } from "antd"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function Listado(props: Pick<ControlProps, "filter">) {

    const { contextPrestamos: { state, editar, todos } } = useData()
    const { datos, procesando, recargar } = state
    const { filter = '' } = props
    const url = useLocation()
    const { Column } = Table

    const cargar = async () => await todos();

    useEffect(() => { cargar() }, [url.pathname])
    useEffect(() => { if (recargar) cargar() }, [recargar])

    return (
        <Table<Prestamo>
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
                                item.codigo.toLowerCase().indexOf(filter) >= 0 ||
                                (item.cliente?.codigo || '').toString().indexOf(filter) >= 0 ||
                                (item.cliente?.nombres || '').toString().indexOf(filter) >= 0 ||
                                (item.cliente?.apellidos || '').toString().indexOf(filter) >= 0
                            )
                        })
                        .map((item, index) => { return { ...item, key: index + 1 } })
            } locale={{ emptyText: <Flex>0 prestamos</Flex> }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
            <Column title="Código" dataIndex="codigo" key="codigo" />
            <Column title="Fecha Cr&eacute;dito" render={(record: Prestamo) => (record.fechaCredito)} />
            <Column title="Cliente" render={(record: Prestamo) => (`${record.cliente?.nombres} ${record.cliente?.apellidos}`.trim())} />
            <Column title="Monto" render={(record: Prestamo) => (record.deudaInicial)} />
            <Column title="Capital" render={(record: Prestamo) => (record.capital)} />
            <Column title="Interes" render={(record: Prestamo) => (record.interes)} />
            <Column title="M&eacute;todo de Pago" render={(record: Prestamo) => (record.metodoPago?.nombre)} />
            <Column title="Estado" render={(record: Prestamo) => (
                <Tag color={record.estado?.id ? '#87d068' : 'red'}>{record.estado?.nombre ? 'Activo' : 'Inactivo'}</Tag>
            )} />
            <Column title="Acci&oacute;n" align="center" width={80} render={(record: Prestamo) => (
                <Tooltip title={`Editar el prestamo (${record.codigo})`}>
                    <ButtonEdit type="text" onClick={() => { editar(record) }} />
                </Tooltip>
            )} />
        </Table>
    )

}