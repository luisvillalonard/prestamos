import StyleProvider from '@components/providers/styles.tsx'
import { ContextsProvidersTree } from '@hooks/useData.ts'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/">
    <StyleProvider>
      <ContextsProvidersTree>
        <App />
      </ContextsProvidersTree>
    </StyleProvider>
  </BrowserRouter>,
)
