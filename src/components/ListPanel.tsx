import { ReactElement, useEffect, useState } from "react";
import { useMapContext } from "../context/MapContext";
import { Trash } from "../types";
import { TrashList } from "./TrashList";

export const ListPanel = (): ReactElement => {
  const { trashList, selectedTrash, getTrashByCampagne, setSelectedTrash } = useMapContext();
  const [trashByCapagne, setTrashByCapagne] = useState<Trash[] | null>(null);
  const [isModeTrash, setIsModeTrash] = useState(false);

  useEffect(() => {
    setIsModeTrash(selectedTrash ? false : true);
    if (!selectedTrash) return;
    const campaignId = selectedTrash.id_ref_campaign_fk;
    const trashList = getTrashByCampagne(campaignId);
    console.log(trashList);
    setTrashByCapagne(trashList);
  }, [selectedTrash]);

  return (
    <div className="map-details-panel">
      <div className="flex w-full p-2 bg-white mb-3 panel-action-top">
        <div className={`flex-1 py-2 panel-actions-item ${isModeTrash && 'active'}`} onClick={() => {
          setIsModeTrash(true);
          setSelectedTrash(null!)
        }} >
          Tout
        </div>
        <div className={`flex-1 py-2 panel-actions-item ${!isModeTrash && 'active'}`} onClick={() => {
          if (!selectedTrash) return;
          setIsModeTrash(false);
        }} >
          Campagne
        </div>
      </div>

      {isModeTrash && trashList && <TrashList trashList={trashList} />}
      {!isModeTrash && trashByCapagne && <TrashList trashList={trashByCapagne} modeCampaig={true} />}
    </div>
  );
};