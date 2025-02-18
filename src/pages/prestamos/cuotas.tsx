import { Flex, Table } from "antd"

export default function PrestamoCuotas() {

    const { Column } = Table

    return (
        <Table<any>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            dataSource={[]}
            locale={{ emptyText: <Flex>0 cuotas</Flex> }}>
            <Column title={<span style={{ textWrap: 'nowrap' }}># Cuotas</span>} width={50} render={() => ('')} />
            <Column title="Fecha Pago" render={() => ('')} />
            <Column title="Deuda Inicial" render={() => ('')} />
            <Column title="Tasa Interes" render={() => ('')} />
            <Column title="Capital" render={() => ('')} />
            <Column title="Amortización" render={() => ('')} />
            <Column title="Saldo Final" render={() => ('')} />
        </Table>
    )

}