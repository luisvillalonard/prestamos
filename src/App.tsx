/** CSS */
import './App.css'

/* IMPORTS */
import HeaderApp from '@components/layout/header'
import MenuApp from '@components/layout/menu'
import RutasApp from '@components/layout/rutas'
import StyleProvider from '@components/providers/styles'
import { Layout } from 'antd'

export default function App() {

  const { Content } = Layout

  return (
    <StyleProvider>
      <Layout className='h-100'>
        <HeaderApp />
        <Layout>
          <MenuApp />
          <Content className='body-content'>
            <RutasApp />
          </Content>
        </Layout>
      </Layout>
    </StyleProvider>
  )
}
