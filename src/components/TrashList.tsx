import { ReactElement } from "react";
import { useMapContext } from "../context/MapContext";
import { Trash } from "../types";


export const TrashList = ({ trashList, modeCampaig }: { trashList: Trash[], modeCampaig?: boolean }): ReactElement => {
  const { mapBox, setSelectedTrash, setCurrentCampagne } = useMapContext();
  const getTrashType = (type: string): string => {
    switch (type) {
      case "Bottle-shaped":
        return "Zone d'accumulation";
      case "Insulating material":
        return "Encombrant";
      case "Sheet / tarp / plastic bag / fragment":
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
      setSelectedTrash(trashFeature.properties as unknown as Trash);
    }

  }

  return (
    <>
      <div className="trash-list">
        {
          modeCampaig && <div className="flex justify-content-between mb-3">
            <strong>Campagne N</strong>
            <a href="#" onClick={() => {
              setCurrentCampagne("d")
            }}>
              Détails
            </a>
          </div>
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
