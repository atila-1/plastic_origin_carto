import { ReactElement, useEffect, useState } from "react";
import { useMapContext } from "../context/MapContext";
import { Trash } from "../types";
import { TrashList } from "./TrashList";

export const ListPanel = (): ReactElement => {
  const { trashList, selectedTrash, getTrashByCampagne } = useMapContext();
  const [trashByCapagne, setTrashByCapagne] = useState<Trash[] | null>(null);
  const [isModeCampaign, setIsModeCampaign] = useState(false);

  useEffect(() => {
    setIsModeCampaign(selectedTrash ? true : false);
    if (!selectedTrash) return;
    const campaignId = selectedTrash.id_ref_campaign_fk;
    const trashList = getTrashByCampagne(campaignId);
    setTrashByCapagne(trashList);
  }, [selectedTrash]);

  return (
    <div className="map-details-panel">
      <div className="flex w-full p-2 bg-white mb-3 panel-action-top">
        <div className={`flex-1 py-2 panel-actions-item ${!isModeCampaign && 'active'}`} >
          Tout
        </div>
        <div className={`flex-1 py-2 panel-actions-item ${isModeCampaign && 'active'}`} >
          Campagne
        </div>
      </div>

      {!isModeCampaign && trashList && <TrashList trashList={trashList} />}
      {isModeCampaign && trashByCapagne && <TrashList trashList={trashByCapagne} modeCampaig={true} />}
    </div>
  );
};