import { createRoot } from 'react-dom/client'
import 'react-tooltip/dist/react-tooltip.css'
import Map from './components/Map'
import { MapProvider } from './context/MapContext'
import './index.scss'
import '/node_modules/primeflex/primeflex.css'

createRoot(document.getElementById('root')!).render(
  <MapProvider>
    <Map />
  </MapProvider>,
)
