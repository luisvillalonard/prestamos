import { FormatNumber } from "@hooks/useUtils"
import { PrestamoCuota } from "@interfaces/prestamos"
import { Flex, Table } from "antd"

interface PrestamoCuotasProps {
    cuotas: PrestamoCuota[]
}

export default function PrestamoCuotas(props: PrestamoCuotasProps) {

    const { cuotas } = props
    const { Column } = Table

    return (
        <Table<PrestamoCuota>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            dataSource={cuotas && cuotas.map((item, index) => { return { ...item, key: index + 1 } })}
            locale={{ emptyText: <Flex>0 cuotas</Flex> }}>
            <Column title="# Cuota" dataIndex="key" key="key" align="center" fixed='left' width={80} />
            <Column title="Fecha Pago" render={(record: PrestamoCuota) => (record.fechaPago)} />
            <Column title="Deuda Inicial" render={(record: PrestamoCuota) => (FormatNumber(record.deudaInicial, 2))} />
            <Column title="Tasa Interes" render={(record: PrestamoCuota) => (FormatNumber(record.interes, 2))} />
            <Column title="Capital" render={(record: PrestamoCuota) => (FormatNumber(record.capital, 2))} />
            <Column title="Amortización" render={(record: PrestamoCuota) => (FormatNumber(record.amortizacion, 2))} />
            <Column title="Saldo Final" render={(record: PrestamoCuota) => (FormatNumber(record.saldoFinal, 2))} />
        </Table>
    )

}