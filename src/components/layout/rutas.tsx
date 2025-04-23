import { Urls } from '@hooks/useConstants'
import PageClienteCargaMasiva from '@pages/clientes/carga/page'
import FormCliente from '@pages/clientes/form'
import PageClientes from '@pages/clientes/page'
import PageConfiguraiones from '@pages/configuraciones/page'
import PageDashboard from '@pages/dashboard/dash'
import PageAcesores from '@pages/dataMaestra/acesores/page'
import PageCiudades from '@pages/dataMaestra/ciudades/page'
import PageDocumentosTipos from '@pages/dataMaestra/documentosTipos/page'
import PageFormasPago from '@pages/dataMaestra/formasPago/page'
import PageMetodosPago from '@pages/dataMaestra/metodosPago/page'
import PageMonedas from '@pages/dataMaestra/monedas/page'
import PageOcupaciones from '@pages/dataMaestra/ocupaciones/page'
import PagePrestamosEstados from '@pages/dataMaestra/prestamosEstados/page'
import PageHome from '@pages/home'
import PageNotFound from '@pages/not-found'
import PageCobroAutomatico from '@pages/prestamos/cobros/automatico/page'
import PagePrestamoCobro from '@pages/prestamos/cobros/page'
import FormPrestamoEditar from '@pages/prestamos/editar'
import FormPrestamoNuevo from '@pages/prestamos/nuevo'
import PagePrestamos from '@pages/prestamos/page'
import PageLogin from '@pages/seguridad/login/page'
import FormPermisos from '@pages/seguridad/permisos/form'
import PagePermisos from '@pages/seguridad/permisos/page'
import PageUsuarios from '@pages/seguridad/usuarios/page'
import { Route, Routes } from 'react-router-dom'

const RutasApp = () => {

    return (
        <Routes>
            <Route path={'/'} element={<PageHome />} />
            <Route path={Urls.Dashboard} element={<PageDashboard />} />
            <Route path='*' element={<PageNotFound />} />
            <Route path={Urls.Login} element={<PageLogin />} />
            <Route path={Urls.Clientes.Base}>
                <Route path={Urls.Clientes.Nuevo} element={<FormCliente />} />
                <Route path={Urls.Clientes.Editar} element={<FormCliente />} />
                <Route path={Urls.Clientes.Registrados} element={<PageClientes />} />
                <Route path={Urls.Clientes.CargaMasiva} element={<PageClienteCargaMasiva />} />
            </Route>
            <Route path={Urls.DataMaestra.Base}>
                <Route path={Urls.DataMaestra.Ciudades} element={<PageCiudades />} />
                <Route path={Urls.DataMaestra.DocumentosTipos} element={<PageDocumentosTipos />} />
                <Route path={Urls.DataMaestra.FormasPago} element={<PageFormasPago />} />
                <Route path={Urls.DataMaestra.MetodosPago} element={<PageMetodosPago />} />
                <Route path={Urls.DataMaestra.Monedas} element={<PageMonedas />} />
                <Route path={Urls.DataMaestra.Ocupaciones} element={<PageOcupaciones />} />
                <Route path={Urls.DataMaestra.PrestamosEstados} element={<PagePrestamosEstados />} />
                <Route path={Urls.DataMaestra.Acesores} element={<PageAcesores />} />
            </Route>
            <Route path={Urls.Prestamos.Base}>
                <Route path={Urls.Prestamos.Nuevo} element={<FormPrestamoNuevo />} />
                <Route path={Urls.Prestamos.Editar} element={<FormPrestamoEditar />} />
                <Route path={Urls.Prestamos.Registrados} element={<PagePrestamos />} />
                <Route path={Urls.Prestamos.Cobro} element={<PagePrestamoCobro />} />
                <Route path={Urls.Prestamos.CobroAutomatico} element={<PageCobroAutomatico />} />
            </Route>
            <Route path={Urls.Seguridad.Base}>
                <Route path={Urls.Seguridad.Permisos} element={<PagePermisos />} />
                <Route path={Urls.Seguridad.PermisosFormulario} element={<FormPermisos />} />
                <Route path={Urls.Seguridad.Usuarios} element={<PageUsuarios />} />
            </Route>
            <Route path={Urls.Configuraciones.Base}>
                <Route path={Urls.Configuraciones.Generales} element={<PageConfiguraiones />} />
            </Route>
        </Routes>
    )

}
export default RutasApp