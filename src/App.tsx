/** CSS */
import './App.css'

/* IMPORTS */
import HeaderApp from '@components/layout/header'
import MenuApp from '@components/layout/menu'
import RutasApp from '@components/layout/rutas'
import { Layout } from 'antd'

export default function App() {

  const { Content } = Layout

  return (
    <Layout className='h-100'>
      <HeaderApp />
      <Layout>
        <MenuApp />
        <Content className='body-content'>
          <RutasApp />
        </Content>
      </Layout>
    </Layout>
  )
}
