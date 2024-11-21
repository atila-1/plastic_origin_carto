import { X } from "@phosphor-icons/react";
import { ReactElement, useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip';
import { useMapContext } from "../context/MapContext";
import { Trash } from "../types";
import { TrashList } from "./TrashList";
export const ListPanel = (): ReactElement => {
  const { trashList, selectedTrash, getTrashByCampagne, setSelectedTrash } = useMapContext();
  const [trashByCapagne, setTrashByCapagne] = useState<Trash[] | null>(null);
  const [isModeTrash, setIsModeTrash] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  useEffect(() => {
    setIsModeTrash(selectedTrash ? false : true);
    if (!selectedTrash) return;
    setIsPanelVisible(true);
    const campaignId = selectedTrash.id_ref_campaign_fk;
    const trashList = getTrashByCampagne(campaignId);
    setTrashByCapagne(trashList);
  }, [selectedTrash]);

  const closePanel = (): void => {
    setIsPanelVisible(false);
    setSelectedTrash(null!);
    setTrashByCapagne(null);
  }

  const setModeTrash = (): void => {
    setIsModeTrash(true);
  }

  const setModeCampaign = (): void => {
    if (!selectedTrash) return;
    setIsModeTrash(false);
  }

  if (!isPanelVisible) return <div></div>;

  return (
    <div className="map-details-panel">
      <button className="btn-close" onClick={closePanel}>
        <X size={32} />
      </button>
      <div className="flex w-full p-2 bg-white mb-3 panel-action-top">
        <div className={`flex-1 py-2 panel-actions-item ${isModeTrash && 'active'}`} onClick={setModeTrash} >
          Tout
        </div>
        <div className={`flex-1 py-2 panel-actions-item ${!isModeTrash && 'active'}`} onClick={setModeCampaign} data-tooltip-id="tooltip" data-tooltip-content="Cliquez sur un point pour voir les données liées à sa campagne">
          Campagne
        </div>
      </div>
      {isModeTrash && trashList && <TrashList trashList={trashList} />}
      {!isModeTrash && trashByCapagne && <TrashList trashList={trashByCapagne} modeCampaig={true} />}
      {isModeTrash && !trashByCapagne && <Tooltip id="tooltip" />}
    </div>
  );
};