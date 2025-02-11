import { ButtonPrimary } from "@components/buttons/primary";
import Searcher from "@components/inputs/searcher";
import { Card, Flex, Space, Table } from "antd";

export default function Listado() {

    const { Column } = Table

    return (
        <Card>
            <Flex justify="space-between" className="pb-3">
                <Space>
                    <Searcher />
                </Space>
                <Space>
                    <ButtonPrimary>Primary</ButtonPrimary>
                </Space>
            </Flex>
            <Table
                size="middle"
                bordered={false}
                pagination={{ size: 'default' }}
                dataSource={[]}
                locale={{ emptyText: <Flex>0 clientes</Flex> }}
                scroll={{ x: 1300 }}>
                <Column title="#" dataIndex="key" key="key" align="center" fixed="left" width={60} />
                <Column title="C&oacute;digo" fixed="left" width={100} render={() => ('')} />
                <Column title="C&oacute;digo Empleado" render={() => ('')} />
                <Column title="Nombres y Apellidos" render={() => ('')} />
                <Column title="C&eacute;dula / Pasaporte" render={() => ('')} />
                <Column title="Sexo" render={() => ('')} />
                <Column title="Ciudad" render={() => ('')} />
                <Column title="Direcci&oacute;n" render={() => ('')} />
                <Column title="Tel&eacute;fono Celular" render={() => ('')} />
                <Column title="Tel&eacute;fono Fijo" render={() => ('')} />
            </Table>
        </Card>
    )
}