
import { ReactElement } from 'react';
import DateBar from './DateBar';
import SearchBar from './SearchBar';
import { SliderMap } from './SliderMap';

const MapToolbar = (): ReactElement => {
  return (
    <>
      <div className="map-toolbar">
        <SearchBar />
        <DateBar />
        <SliderMap />
      </div>
    </>
  );
};

export default MapToolbar;
