import { useData } from "@hooks/useData";
import { ControlProps } from "@interfaces/globales";
import { List, notification } from "antd";
import { useEffect } from "react";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function UserInfoNotification(props: Pick<ControlProps, "isOpen">) {

    const { isOpen } = props
    const { contextAuth: { state: { user }, showUserInfo } } = useData()
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            placement: "topRight",
            message: <span style={{ fontWeight: 'bolder' }}>Informaci&oacute;n del Usuario</span>,
            description: <>
                <List>
                    <List.Item>
                        <List.Item.Meta title="Nombre de Usuario" description={user?.acceso || 'Desconocido'} />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta title="C&oacute;digo Empleado" description={user?.empleadoId || 'Desconocido'} />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta title="Correo Electr&oacute;nico" description={user?.correo || 'Desconocido'} />
                    </List.Item>
                </List>
            </>,
            onClose: showUserInfo,
        });
    };

    useEffect(() => {
        if (isOpen) {
            openNotificationWithIcon('success');
        }
    }, [isOpen])

    return (
        <>{contextHolder}</>
    )
}