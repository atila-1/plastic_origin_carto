import { ReactElement } from "react";
import { useMapContext } from "../context/MapContext";
import { TrashList } from "./TrashList";

export const ListPanel = (): ReactElement => {
  const { trashList } = useMapContext();
  return (
    <div className="map-details-panel">
      {trashList && trashList.length > 0 && <TrashList trashList={trashList} />}
    </div>
  );
};