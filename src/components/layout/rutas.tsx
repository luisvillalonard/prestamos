import { useConstants } from '@hooks/useConstants'
import PageClientes from '@pages/clientes/page'
import PageHome from '@pages/home'
import PageNotFound from '@pages/not-found'
import PageLogin from '@pages/seguridad/login'
import PageUsuarios from '@pages/seguridad/usuarios/page'
import { Outlet, Route, Routes } from 'react-router-dom'

const RutasApp = () => {

    const { Urls } = useConstants()

    return (
        <Routes>
            <Route path={'/'} element={<PageHome />} />
            <Route path='*' element={<PageNotFound />} />
            <Route path={Urls.Login} element={<PageLogin />} />
            <Route path={Urls.Clientes.Base}>
                <Route path={Urls.Clientes.Formulario} element={<Outlet />} />
                <Route path={Urls.Clientes.Historico} element={<PageClientes />} />
            </Route>
            <Route path={Urls.Seguridad.Base}>
                <Route path={Urls.Seguridad.Usuarios} element={<PageUsuarios />} />
            </Route>
        </Routes>
    )

}
export default RutasApp