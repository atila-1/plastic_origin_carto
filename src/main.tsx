import { createRoot } from 'react-dom/client'
import Map from './components/Map'
import { MapProvider } from './context/MapContext'
import './index.css'
import '/node_modules/primeflex/primeflex.css'

createRoot(document.getElementById('root')!).render(
  <MapProvider>
    <Map />
  </MapProvider>,
)
