import { Map } from 'mapbox-gl';
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';
import { Campaign, LocationPoint, Trash } from '../types';

interface MapContextProps {
  bounds: [number, number, number, number] | null;
  locationPoint: LocationPoint | null;
  mapBox: Map | null;
  trashList: Trash[] | null;
  trashListApi: Trash[] | null;
  selectedTrash: Trash | null;
  currentCampagne: Campaign | null;
  setCurrentCampagne: (campagne: Campaign) => void;
  setBounds: (bounds: [number, number, number, number]) => void;
  setLocationPoint: (locationPoint: LocationPoint) => void;
  resetLocation: () => void;
  setTrashList: (trashList: Trash[]) => void;
  setMapBox: (mapBox: Map) => void;
  setSelectedTrash: (trash: Trash) => void;
  getTrashByCampagne: (campagne: string) => Trash[];
  setTrashListApi: (trashList: Trash[]) => void;

}

const MapContext = createContext<MapContextProps | undefined>(undefined);
export const MapProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [bounds, setBounds] = useState<[number, number, number, number] | null>([-8.0, 33.0, 28, 66.0]);
  const [locationPoint, setLocationPoint] = useState<LocationPoint | null>(null);
  const [trashList, setTrashList] = useState<Trash[] | null>(null);
  const [mapBox, setMapBox] = useState<Map | null>(null);
  const [selectedTrash, setSelectedTrash] = useState<Trash>(null!);
  const [currentCampagne, setCurrentCampagne] = useState<Campaign | null>(null);
  const [trashListApi, setTrashListApi] = useState<Trash[] | null>(null);

  const resetLocation = (): void => {
    setLocationPoint(null);
  }

  const getTrashByCampagne = (campagne: string): Trash[] => {
    return trashListApi?.filter((trash) => trash.id_ref_campaign_fk === campagne) || [];
  }

  return (
    <MapContext.Provider
      value={
        {
          bounds, setBounds,
          locationPoint, setLocationPoint,
          resetLocation, trashList,
          setTrashList, getTrashByCampagne,
          mapBox, setMapBox,
          selectedTrash, setSelectedTrash,
          currentCampagne, setCurrentCampagne,
          trashListApi, setTrashListApi
        }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = (): MapContextProps => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext debe usarse dentro de MapProvider');
  }
  return context;
};