import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useMapContext } from '../context/MapContext';
import { Trash } from '../types';
import DateBar from './DateBar';
import { ListPanel } from './ListPanel';
import SearchBar from './SearchBar';
import TrashLayer from './TrashLayer';

const MapApp = (): ReactElement => {
  const { setTrashList, setMapBox } = useMapContext();
  const [zoom, setZoom] = useState(5);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/anaishy/clxygwhkz001d01pn1kan0dhw',
      center: [2.1, 46.1],
      zoom: zoom,
      minZoom: 5,
      maxZoom: 16
    });

    mapRef.current.addControl(new mapboxgl.FullscreenControl());
    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
      mapRef.current!.resize();
      setMapBox(mapRef.current!);
    });

    const updateVisibleFeatures = (): void => {
      const map = mapRef.current;
      if (!map) return;
      if (!map.getSource('data')) return;
      setZoom(map.getZoom());
      // if (zoom < 13) {
      //   setTrashList([]);
      //   return;
      // }
      const features = map.queryRenderedFeatures({
        layers: ['circle_trash']
      });
      setTrashList(features.map((feature) => feature.properties as Trash));
    };

    mapRef.current.on('moveend', updateVisibleFeatures);
    return (): void => {
      mapRef.current!.remove();
      mapRef.current!.off('moveend', updateVisibleFeatures);
    };
  }, []);

  return (
    <div className="relative">
      {isMapLoaded && <SearchBar map={mapRef.current!} />}
      <DateBar />
      <div id="map-container" ref={mapContainerRef} className="map-container" />
      {isMapLoaded && <TrashLayer map={mapRef.current!} />}
      {zoom >= 13.5 && <ListPanel />}
    </div>
  );
};

export default MapApp;
