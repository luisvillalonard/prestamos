import { ButtonDefault } from "@components/buttons/default"
import Searcher from "@components/inputs/searcher"
import { useData } from "@hooks/useData"
import { FormatNumber } from "@hooks/useUtils"
import { ControlProps } from "@interfaces/globales"
import { Prestamo } from "@interfaces/prestamos"
import { Col, Flex, Row, Table } from "antd"
import { useEffect, useState } from "react"

export default function BuscadorPrestamo(props: Pick<ControlProps, "onChange">) {

    const { onChange } = props
    const { contextPrestamos: { activos } } = useData()
    const [filtroPrestamo, setFiltroPrestamo] = useState<string>('')
    const [prestamos, setPrestamos] = useState<Prestamo[]>([])

    const buscarPrestamo = async () => {

        if (filtroPrestamo) {
            const result = await activos({
                pageSize: 999999,
                currentPage: 1,
                filter: filtroPrestamo
            })
            if (result && result.ok) {
                setPrestamos(result.datos ?? [])
            }
        }
    }

    const montoPendiente = (prestamo: Prestamo): number => {

        const { monto, prestamoCuotas } = prestamo
        if (!prestamoCuotas || prestamoCuotas.length === 0) return monto;

        const cuotasPendientes = prestamoCuotas.filter(cuota => !cuota.pagado)

        const total = cuotasPendientes.reduce((acc, item) => {
            const montoPagos: number = item.pagos.reduce((accP, itemP) => { return accP + itemP.monto }, 0);
            let montoFinal: number = montoPagos - item.descuento;
            if (montoFinal < 0) {
                montoFinal = montoFinal * -1;
            }
            return acc - montoFinal;
        }, monto)

        return Math.round(total)
    }

    useEffect(() => { buscarPrestamo() }, [filtroPrestamo])

    return (
        <>
            <Row>
                <Col xs={12}>
                    <Searcher
                        size="large"
                        value={filtroPrestamo}
                        onChange={setFiltroPrestamo}
                        placeholder="buscar prestamo por c&oacute;digo, &oacute; datos del cliente"
                        style={{ width: '100%', marginBottom: 10 }} />
                </Col>
                <Col xs={24}>
                    <Table<Prestamo>
                        size="middle"
                        bordered={false}
                        locale={{ emptyText: <Flex style={{ textWrap: 'nowrap' }}>0 prestamos</Flex> }}
                        dataSource={prestamos.map((item, index) => { return { ...item, key: index + 1 } })}>
                        <Table.Column title="#" align="center" fixed='left' width={120} render={(record: Prestamo) => (
                            <ButtonDefault
                                size="small"
                                shape="round"
                                onClick={() => { onChange && onChange(record) }}>
                                Seleccionar
                            </ButtonDefault>
                        )} />
                        <Table.Column title="Código" dataIndex="codigo" key="codigo" ellipsis />
                        <Table.Column title="Fecha Cr&eacute;dito" render={(record: Prestamo) => (<span style={{ textWrap: 'nowrap' }}>{record.fechaCredito}</span>)} />
                        <Table.Column title="Cliente" render={(record: Prestamo) => (`${record.cliente?.nombres} ${record.cliente?.apellidos}`.trim())} />
                        <Table.Column title="Monto" render={(record: Prestamo) => (FormatNumber(record.monto, 2))} />
                        <Table.Column title="Inter&eacute;s" render={(record: Prestamo) => (FormatNumber(Math.round(record.prestamoCuotas.reduce((acc, item) => { return acc + item.interes }, 0)), 2))} />
                        <Table.Column title="Pendiente" render={(record: Prestamo) => (
                            FormatNumber(montoPendiente(record), 2)
                        )} />
                        <Table.Column title="M&eacute;todo de Pago" render={(record: Prestamo) => (record.metodoPago?.nombre)} />
                    </Table>
                </Col>
            </Row>
        </>
    )
}