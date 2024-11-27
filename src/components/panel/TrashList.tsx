import { useMapContext } from "@context/MapContext";
import { Trash } from "@types";
import { ReactElement } from "react";
import { CampagneDetails } from "./CampagneDetails";



export const TrashList = ({ trashList, modeCampaig }: { trashList: Trash[], modeCampaig?: boolean }): ReactElement => {
  const { mapBox, setSelectedTrash } = useMapContext();
  const getTrashType = (type: string): string => {
    switch (type) {
      case "AccumulationZone":
        return "Zone d'accumulation";
      case "BulkyTrash":
        return "Encombrant";
      case "Trash":
        return "Déchet";
      default:
        return type;
    }
  };

  const onTrashItemClick = (trash: Trash): void => {
    // search for the trash in the map
    if (!mapBox) return;
    const trashFeature = mapBox.querySourceFeatures('data', {
      filter: ['==', 'id', trash.id]
    })[0];
    if (trashFeature) {
      setSelectedTrash(trashFeature.properties as unknown as Trash);
    }
    mapBox.flyTo({
      center: (trashFeature.geometry as any).coordinates!,
      zoom: 14
    });
  }

  return (
    <>
      <div className="trash-list">
        {
          modeCampaig && <CampagneDetails idCampaign={trashList[0].id_ref_campaign_fk} />
        }
        <div className="trash-list-body">
          {trashList.map((trash, index) => (
            <div className="trash-item flex flex-column gap-1 mb-1" key={index} onClick={() => { onTrashItemClick(trash) }}>
              <p><span>Recensé le :</span> {new Date(trash.time).toLocaleString()}</p>
              <p className={trash.type_name}><span>Type déchet :</span> {getTrashType(trash.type_name)}</p>
              <p><span>Cours d’eau :</span> {trash.river_name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
