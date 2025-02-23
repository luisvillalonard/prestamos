/** CSS */
import './App.css'

/* IMPORTS */
import HeaderApp from '@components/layout/header'
import MenuApp from '@components/layout/menu'
import RutasApp from '@components/layout/rutas'
import UserInfoNotification from '@components/layout/userInfo'
import { useData } from '@hooks/useData'
import PageLogin from '@pages/seguridad/login/page'
import { Layout, theme } from 'antd'
import { useEffect } from 'react'

export default function App() {

  const { contextAuth: { state: { user, viewInfoUser }, getUserApp } } = useData()
  const { Content } = Layout
  const { token } = theme.useToken()

  useEffect(() => {
    getUserApp();
  }, [])

  if (!user) {
    return <PageLogin />
  }

  return (
    <Layout className='h-100'>
      <HeaderApp />
      <Layout style={{ backgroundColor: token.colorBgContainer }}>
        <UserInfoNotification isOpen={viewInfoUser} />
        <MenuApp />
        <Content className='p-4 position-relative overflow-auto'>
          <RutasApp />
        </Content>
      </Layout>
    </Layout>
  )
}
