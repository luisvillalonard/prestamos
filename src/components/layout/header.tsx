import { Colors } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { useIconos } from "@hooks/useIconos"
import { Button, Flex, Layout, Popconfirm, Tooltip, Typography } from "antd"

const HeaderApp = () => {

  const { Header } = Layout
  const { Title } = Typography
  const { contextAuth: { state: { user }, LoggedOut, showMenu, showUserInfo } } = useData()
  const { IconMenu, IconUser, IconLogout } = useIconos()
  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  }

  return (
    <Header style={headerStyle}>
      <Flex align="center" justify="space-between" style={{ width: '100%' }}>
        <Flex align="center" gap={20}>
          <Title level={2} style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>SISTEMA</Title>
          <Button type="text" icon={<IconMenu style={{ fontSize: 24, color: Colors.White }} />} onClick={showMenu} />
        </Flex>
        <Flex align="center">
          <Tooltip title="Ver mis datos">
            <Button type="text" icon={<IconUser style={{ fontSize: 22 }} />} style={{ color: 'rgba(255,255,255,0.8)' }} onClick={showUserInfo}>
              {user?.acceso || 'Desconocido'}
            </Button>
          </Tooltip>
          <Tooltip title="Cerrar la sesi&oacute;n">
            <Popconfirm
              placement="bottomRight"
              title={<div className="fs-5">Cerrar la sesi&oacute;n</div>}
              description={<div className="fs-6">Esta seguro(a) que desea cerrar la sesi&oacute;n actual?</div>}
              icon={<></>}
              okText="Aceptar"
              okButtonProps={{ size: 'middle', variant: 'solid', color: 'primary', shape: 'round' }}
              cancelText="Cancelar"
              cancelButtonProps={{ size: 'middle', type: 'text' }}
              onConfirm={LoggedOut}>
              <Button type="text" icon={<IconLogout style={{ fontSize: 20 }} />} style={{ color: 'rgba(255,255,255,0.8)' }}>Salir</Button>
            </Popconfirm>
          </Tooltip>
        </Flex>
      </Flex>
    </Header>
  )
}
export default HeaderApp;
