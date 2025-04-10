import { Colors } from "@hooks/useConstants";
import { Cliente } from "@interfaces/clientes";
import { Divider, Flex, Space } from "antd";

type ClienteProps = {
    cliente?: Cliente
}

export default function ClienteInfo(props: ClienteProps) {

    const { cliente } = props

    return (
        <Space split={<Divider type="vertical" className="h-100 d-inline" style={{ borderColor: Colors.Secondary }} />}>
            <Flex vertical>
                <strong color={Colors.Secondary}>C&oacute;digo Empleado</strong>
                <span>{cliente?.empleadoId || 'Desconocido'}</span>
            </Flex>
            <Flex vertical>
                <strong color={Colors.Secondary}>Nombres y Apellidos</strong>
                <span>{`${cliente?.nombres || ''} ${cliente?.apellidos || ''}`.trim() || 'Desconocido'}</span>
            </Flex>
            <Flex vertical>
                <strong color={Colors.Secondary}>Tel&eacute;fono Celular</strong>
                <span>{cliente?.telefonoCelular || 'Desconocido'}</span>
            </Flex>
            <Flex vertical>
                <strong color={Colors.Secondary}>Ocupaci&oacute;n</strong>
                <span>{cliente?.ocupacion?.nombre || 'Desconocido'}</span>
            </Flex>
        </Space>
    )
}