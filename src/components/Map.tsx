import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useEffect, useRef, useState } from 'react';
import DateBar from './DateBar';
import SearchBar from './SearchBar';
import TrashLayer from './TrashLayer';
const MapApp = (): ReactElement => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  const [lng, setLng] = useState(2.1); // -1.0
  const [lat, setLat] = useState(46.1); // 43.47
  const [zoom, setZoom] = useState(5); // 14
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/anaishy/clxygwhkz001d01pn1kan0dhw',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 4
    });

    mapRef.current.addControl(new mapboxgl.FullscreenControl());
    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
      mapRef.current!.resize();
    });

    return (): void => {
      mapRef.current!.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on('move', () => {
      setLng(+mapRef.current!.getCenter().lng.toFixed(4));
      setLat(+mapRef.current!.getCenter().lat.toFixed(4));
      setZoom(+mapRef.current!.getZoom().toFixed(2));
    });
  }, [mapRef]);

  return (
    <div className="relative">
      {isMapLoaded && <SearchBar map={mapRef.current!} />}
      <DateBar />
      <div id="map-container" ref={mapContainerRef} className="map-container" />
      {isMapLoaded && <TrashLayer map={mapRef.current!} />}
    </div>
  );
};

export default MapApp;
