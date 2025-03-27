import { Flex } from "antd";

export default function PageHome() {

    /* const { contextAuth: { state: { user } } } = useData()

    if (!user) {
        return <Outlet />
    } else if (user.rol?.esAdmin) {
        return <PageDashboard />
    } */

    return (
        <Flex vertical align="center" justify="center" className="h-100">
            <h1 className="display-2">Bienvenido(a),</h1>
            <h1 className="fs-2">Bienvenido(a),</h1>
        </Flex>
    )
}