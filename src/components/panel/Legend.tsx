import { ReactElement } from "react"

export const Legend = (): ReactElement => {
  return (
    <div className="flex bg-white gap-2 legends-content">
      <li className="legend-item">
        <span className="indicateur Trash"></span>
        Déchet
      </li>
      <li className="legend-item">
        <span className="indicateur BulkyTrash"></span>
        Encombrant
      </li>
      <li className="legend-item">
        <span className="indicateur AccumulationZone"></span>
        Zone d'accumulation
      </li>
    </div>
  )
}