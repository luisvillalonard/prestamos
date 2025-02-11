import { useConstants } from "@hooks/useConstants"
import { useIconos } from "@hooks/useIconos"
import type { MenuProps } from 'antd'
import { Flex, Layout, Menu } from "antd"

const HeaderApp = () => {

  const { Header } = Layout
  const { IconUser, IconLogout } = useIconos()
  useConstants()
  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end'
  }

  type MenuItem = Required<MenuProps>['items'][number];

  const items: MenuItem[] = [
    {
      key: 'usuario',
      label: 'Usuario',
      icon: <IconUser style={{ fontSize: 20 }} />,
    },
    {
      key: 'salida',
      label: 'Salir',
      icon: <IconLogout style={{ fontSize: 20 }} />,
    },
  ];

  return (
    <Header style={headerStyle}>
      <Flex justify="flex-end">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Flex>
    </Header>
  )
}
export default HeaderApp;
