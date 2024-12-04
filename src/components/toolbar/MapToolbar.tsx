
import { useMapContext } from '@context/MapContext';
import { ReactElement } from 'react';
import DateBar from './DateBar';
import SearchBar from './SearchBar';
import { SliderMap } from './SliderMap';

const MapToolbar = (): ReactElement => {
  const { isAppReady } = useMapContext();
  return (
    <>
      <div className="map-toolbar">
        <SearchBar />
        <DateBar />
        {isAppReady && <SliderMap />}
      </div>
    </>
  );
};

export default MapToolbar;
