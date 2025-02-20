/** CSS */
import './App.css'

/* IMPORTS */
import HeaderApp from '@components/layout/header'
import MenuApp from '@components/layout/menu'
import RutasApp from '@components/layout/rutas'
import UserInfoNotification from '@components/layout/userInfo'
import { useData } from '@hooks/useData'
import PageLogin from '@pages/seguridad/login/page'
import { Layout } from 'antd'
import { useEffect } from 'react'

export default function App() {

  const { contextAuth: { state: { user, viewInfoUser }, getUserApp } } = useData()
  const { Content } = Layout

  useEffect(() => {
    getUserApp();
  }, [])

  if (!user) {
    return <PageLogin />
  }

  return (
    <Layout className='h-100'>
      <HeaderApp />
      <Layout>
        <UserInfoNotification isOpen={viewInfoUser} />
        <MenuApp />
        <Content className='body-content'>
          <RutasApp />
        </Content>
      </Layout>
    </Layout>
  )
}
