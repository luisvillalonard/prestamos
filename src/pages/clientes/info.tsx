import { Colors } from "@hooks/useConstants";
import { instanceOf } from "@hooks/useUtils";
import { Cliente, VwCliente } from "@interfaces/clientes";
import { Divider, Flex, Space } from "antd";

type ClienteProps = {
    cliente?: Cliente | VwCliente
}

export default function ClienteInfo(props: ClienteProps) {

    const { cliente } = props;
    const isView = instanceOf<VwCliente>(cliente, 'nombreCompleto')

    return (
        <Space split={<Divider type="vertical" className="h-100 d-inline" style={{ borderColor: Colors.Secondary }} />}>
            <Flex vertical>
                <strong color={Colors.Secondary}>C&oacute;digo Empleado</strong>
                <span>{cliente?.empleadoId || 'Desconocido'}</span>
            </Flex>
            <Flex vertical>
                <strong color={Colors.Secondary}>Nombres y Apellidos</strong>
                <span>
                    {
                        isView
                            ? cliente?.nombreCompleto || 'Desconocido'
                            : `${cliente?.nombres || ''} ${cliente?.apellidos || ''}`.trim() || 'Desconocido'
                    }
                </span>
            </Flex>
            <Flex vertical>
                <strong color={Colors.Secondary}>Tel&eacute;fono Celular</strong>
                <span>{cliente?.telefonoCelular || 'Desconocido'}</span>
            </Flex>
            <Flex vertical>
                <strong color={Colors.Secondary}>Ocupaci&oacute;n</strong>
                <span>{isView ? cliente?.ocupacion || 'Desconocido' : cliente?.ocupacion?.nombre || 'Desconocido'}</span>
            </Flex>
        </Space>
    )
}