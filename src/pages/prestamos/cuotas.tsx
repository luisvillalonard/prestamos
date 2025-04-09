import { TagDanger, TagSecondary, TagSuccess } from "@components/tags/tags"
import { FormatNumber } from "@hooks/useUtils"
import { PrestamoCuota, PrestamoPago } from "@interfaces/prestamos"
import { Flex, Table } from "antd"

interface PrestamoCuotasProps {
    cuotas: PrestamoCuota[]
}

export default function PrestamoCuotas(props: PrestamoCuotasProps) {

    const { cuotas } = props

    const montoPendiente = (cuota: PrestamoCuota): number => {

        let montoPagos: number = !cuota.pagos
            ? 0
            : cuota.pagos.reduce((acc: number, item: PrestamoPago) => {
                return acc + item.monto
            }, 0);

        if (montoPagos >= cuota.amortizacion)
            return 0;

        return cuota.amortizacion - montoPagos;

    }

    return (
        <Table<PrestamoCuota>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            dataSource={cuotas && cuotas.map((item, index) => { return { ...item, key: index + 1 } })}
            locale={{ emptyText: <Flex>0 cuotas</Flex> }}>
            <Table.Column title="# Cuota" dataIndex="key" key="key" align="center" fixed='left' width={80} />
            <Table.Column title="Fecha Pago" render={(record: PrestamoCuota) => (record.fechaPago)} />
            <Table.Column title="Deuda Inicial" render={(record: PrestamoCuota) => (FormatNumber(record.deudaInicial, 2))} />
            <Table.Column title="Tasa Interes" render={(record: PrestamoCuota) => (FormatNumber(record.interes, 2))} />
            <Table.Column title="Capital" render={(record: PrestamoCuota) => (FormatNumber(record.capital, 2))} />
            <Table.Column title="Amortización" render={(record: PrestamoCuota) => (FormatNumber(record.amortizacion, 2))} />
            <Table.Column title="Saldo Final" render={(record: PrestamoCuota) => (FormatNumber(record.saldoFinal, 2))} />
            <Table.Column title="Pendiente" render={(record: PrestamoCuota) => (FormatNumber(montoPendiente(record), 2))} />
            <Table.Column title="Estado" align="center" fixed='right' render={(record: PrestamoCuota) => (
                record.pagado
                    ? <TagSuccess text="Pagado" />
                    : record.vencido
                        ? <TagDanger text="Vencida" />
                        : <TagSecondary text="Pendiente" />
            )} />
        </Table>
    )

}