import { useData } from "@hooks/useData"
import PageDashboard from "./dashboard/dash"
import { Outlet } from "react-router-dom"

export default function PageHome() {

    const { contextAuth: { state: { user } } } = useData()

    if (!user) {
        return <Outlet />
    } else if (user.rol?.esAdmin) {
        return <PageDashboard />
    }
    
    return (
        <div>
            <h1>Home Page</h1>
        </div>
    )
}