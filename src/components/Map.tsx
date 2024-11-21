import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useMapContext } from '../context/MapContext';
import { Trash } from '../types';
import DateBar from './DateBar';
import { ListPanel } from './ListPanel';
import { ModalCampaign } from './ModalCampaign';
import SearchBar from './SearchBar';
import TrashLayer from './TrashLayer';

const MapApp = (): ReactElement => {
  const { setTrashList, setMapBox, selectedTrash, currentCampagne } = useMapContext();
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


  useEffect(() => {
    if (!mapRef || !mapRef.current) return;
    const onStyleLoad = (): void => {
      const map = mapRef.current!;
      if (!selectedTrash) {
        if (map.getLayer('circle_trash_highlight')) {
          map.setFilter('circle_trash_highlight', null);
        }
        if (map.getLayer('circle_trash')) {
          map.setFilter('circle_trash', null);
        }
        return;
      }
      const campaignId = selectedTrash.id_ref_campaign_fk;
      if (map.getLayer('circle_trash_highlight')) {
        map.setFilter('circle_trash_highlight', ['==', 'id_ref_campaign_fk', campaignId]);
      }
      if (map.getLayer('circle_trash')) {
        map.setFilter('circle_trash', ['!=', 'id_ref_campaign_fk', campaignId]);
        map.setPaintProperty('circle_trash', 'circle-color', '#CCCCCC');
      }
    };

    if (mapRef.current!.isStyleLoaded()) {
      onStyleLoad();
    } else {
      mapRef.current!.on('style.load', onStyleLoad);
    }

    return (): void => {
      if (mapRef.current) {
        mapRef.current!.off('style.load', onStyleLoad);
      }
    };
  }, [selectedTrash]);

  return (
    <div className="relative">
      {isMapLoaded && <SearchBar map={mapRef.current!} />}
      <DateBar />
      <div id="map-container" ref={mapContainerRef} className="map-container" />
      {isMapLoaded && <TrashLayer map={mapRef.current!} />}
      {zoom >= 12 && <ListPanel />}
      {currentCampagne && <ModalCampaign idCampaign={selectedTrash!.id_ref_campaign_fk} />}
    </div>
  );
};

export default MapApp;
