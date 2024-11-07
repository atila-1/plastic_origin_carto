import { Map } from 'mapbox-gl';
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';
import { LocationPoint, Trash } from '../types';

interface MapContextProps {
  bounds: [number, number, number, number] | null;
  setBounds: (bounds: [number, number, number, number]) => void;
  locationPoint: LocationPoint | null;
  setLocationPoint: (locationPoint: LocationPoint) => void;
  resetLocation: () => void;
  trashList: Trash[] | null;
  setTrashList: (trashList: Trash[]) => void;
  mapBox: Map | null;
  setMapBox: (mapBox: Map) => void;

}

const MapContext = createContext<MapContextProps | undefined>(undefined);
export const MapProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [bounds, setBounds] = useState<[number, number, number, number] | null>([-1.5, 40.0, 1.2, 50.0]);
  const [locationPoint, setLocationPoint] = useState<LocationPoint | null>(null);
  const [trashList, setTrashList] = useState<Trash[] | null>(null);
  const [mapBox, setMapBox] = useState<Map | null>(null);

  const resetLocation = (): void => {
    setLocationPoint(null);
  }

  return (
    <MapContext.Provider value={{ bounds, setBounds, locationPoint, setLocationPoint, resetLocation, trashList, setTrashList, mapBox, setMapBox }}>
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