import { useData } from "@hooks/useData";
import { Flex } from "antd";
import { Outlet } from "react-router-dom";

export default function PageHome() {

    const { contextAuth: { state: { user } } } = useData()

    if (!user) {
        return <Outlet />
    }

    return (
        <Flex vertical align="center" justify="center" className="h-100">
            <h1 className="display-2">Bienvenido(a),</h1>
            <h1 className="fs-2">{user?.acceso}</h1>
        </Flex>
    )
}