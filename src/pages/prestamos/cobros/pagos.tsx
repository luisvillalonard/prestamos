import { Flex, Table } from "antd"

export default function PrestamoPagos() {

    const { Column } = Table

    return (
        <Table<any>
            size="middle"
            bordered={false}
            pagination={{ size: 'default' }}
            dataSource={[]}
            locale={{ emptyText: <Flex>0 cuotas</Flex> }}>
            <Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={50} />
            <Column title="Fecha Cuota" render={() => ('')} />
            <Column title="D&iacute;a" render={() => ('')} />
            <Column title="Deuda Inicial" render={() => ('')} />
            <Column title="Interes" render={() => ('')} />
            <Column title="Capital" render={() => ('')} />
            <Column title="Amortización" render={() => ('')} />
            <Column title="Abono Cuota" render={() => ('')} />
            <Column title="Multa Retraso" render={() => ('')} />
            <Column title="Fecha Pago" render={() => ('')} />
            <Column title="Estado" render={() => ('')} />
            <Column title="D&iacute;as Mora" render={() => ('')} />
            <Column title="Creado Por" render={() => ('')} />
        </Table>
    )

}