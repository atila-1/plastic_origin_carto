import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import Map from './components/Map'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Map />
  </StrictMode>,
)
