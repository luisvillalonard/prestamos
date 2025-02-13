import { ContextsProvidersTree } from '@hooks/useData.ts'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import StyleProvider from '@components/providers/styles.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/">
    <ContextsProvidersTree>
      <StyleProvider>
        <App />
      </StyleProvider>
    </ContextsProvidersTree>
  </BrowserRouter>,
)
