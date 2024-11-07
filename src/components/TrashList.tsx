import { ArrowsHorizontal, MapPin } from "@phosphor-icons/react";
import { ReactElement } from "react";
import { useMapContext } from "../context/MapContext";
import { Trash } from "../types";


export const TrashList = ({ trashList }: { trashList: Trash[] }): ReactElement => {
  const { mapBox } = useMapContext();
  const getTrashType = (type: string): string => {
    switch (type) {
      case "AccumulationZone":
        return "Zone d'accumulation";
      case "BulkyTrash":
        return "Encombrant";
      case "Trash":
        return "Déchet";
      default:
        return "Déchet";
    }
  };

  const onTrashItemClick = (trash: Trash): void => {
    // search for the trash in the map
    if (!mapBox) return;
    const trashFeature = mapBox.querySourceFeatures('data', {
      filter: ['==', 'id', trash.id]
    })[0];
    if (trashFeature) {
      mapBox.flyTo({
        center: (trashFeature.geometry as any).coordinates!,
        zoom: 15
      });
    }

  }

  return (
    <div className="trash-list">
      {trashList.map((trash, index) => (
        <div className="trash-item flex flex-column gap-1" key={index} onClick={() => { onTrashItemClick(trash) }}>
          <p><span>Recensé le :</span> {new Date(trash.time).toDateString()}</p>
          <p className={trash.type_name}><span>Type déchet :</span> {getTrashType(trash.type_name)}</p>
          <p><span>Cours d’eau :</span> {trash.river_name}</p>
          <div className="flex justify-content-between mt-1">
            <span>
              <ArrowsHorizontal size={22} weight="fill" />
            </span>
            <span>
              <MapPin size={22} weight="fill" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
