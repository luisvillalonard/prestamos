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
            <Column title="Deuda Inicial" render={(record: PrestamoCuota) => (record.deudaInicial)} />
            <Column title="Tasa Interes" render={(record: PrestamoCuota) => (record.interes)} />
            <Column title="Capital" render={(record: PrestamoCuota) => (record.capital)} />
            <Column title="Amortización" render={(record: PrestamoCuota) => (record.amortizacion)} />
            <Column title="Saldo Final" render={(record: PrestamoCuota) => (record.saldoFinal)} />
        </Table>
    )

}