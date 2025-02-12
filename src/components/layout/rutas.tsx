import { useConstants } from '@hooks/useConstants'
import PageClientes from '@pages/clientes/page'
import PageCiudades from '@pages/dataMaestra/ciudades/page'
import PageDocumentosTipos from '@pages/dataMaestra/documentosTipos/page'
import PageFormasPago from '@pages/dataMaestra/formasPago/page'
import PageMetodosPago from '@pages/dataMaestra/metodosPago/page'
import PageMonedas from '@pages/dataMaestra/monedas/page'
import PageOcupaciones from '@pages/dataMaestra/ocupaciones/page'
import PagePrestamosEstados from '@pages/dataMaestra/prestamosEstados/page'
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
            <Route path={Urls.DataMaestra.Base}>
                <Route path={Urls.DataMaestra.Ciudades} element={<PageCiudades />} />
                <Route path={Urls.DataMaestra.DocumentosTipos} element={<PageDocumentosTipos />} />
                <Route path={Urls.DataMaestra.FormasPago} element={<PageFormasPago />} />
                <Route path={Urls.DataMaestra.MetodosPago} element={<PageMetodosPago />} />
                <Route path={Urls.DataMaestra.Monedas} element={<PageMonedas />} />
                <Route path={Urls.DataMaestra.Ocupaciones} element={<PageOcupaciones />} />
                <Route path={Urls.DataMaestra.PrestamosEstados} element={<PagePrestamosEstados />} />
            </Route>
            <Route path={Urls.Seguridad.Base}>
                <Route path={Urls.Seguridad.Usuarios} element={<PageUsuarios />} />
            </Route>
        </Routes>
    )

}
export default RutasApp