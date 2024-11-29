
import { useMapContext } from '@context/MapContext';
import { Trash } from '@types';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useEffect, useRef, useState } from 'react';

import { Legend } from './panel/Legend';
import { ListPanel } from './panel/ListPanel';
import { ModalCampaign } from './panel/ModalCampaign';
import MapToolbar from './toolbar/MapToolbar';
import TrashLayer from './TrashLayer';


const MapApp = (): ReactElement => {
  const { setTrashList, setMapBox, selectedTrash, currentCampagne, setCurrentCampagne, setBounds } = useMapContext();
  const [zoom, setZoom] = useState(4.5);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);


  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/anaishy/clxygwhkz001d01pn1kan0dhw',
      center: [2.9, 46.1],
      zoom: zoom,
      minZoom: 4,
      maxZoom: 18
    });

    mapRef.current.addControl(new mapboxgl.FullscreenControl());
    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
      mapRef.current!.resize();
      setMapBox(mapRef.current!);
    });

    mapRef.current.on('sourcedata', (e) => {
      if (e.isSourceLoaded && e.sourceId === 'data' && !isSourceLoaded) {
        setIsSourceLoaded(true);
      }
    });

    const updateVisibleFeatures = (): void => {
      const map = mapRef.current;
      if (!map) return;
      if (!map.getSource('data')) return;
      setZoom(map.getZoom());
      if (map.getZoom() <= 11.5) {
        map._markers.forEach((marker) => {
          marker.remove();
        });
        setTrashList([]);
        return
      }

      const features = map.queryRenderedFeatures({
        layers: ['circle_trash']
      });
      const trashs = features.map((feature) => feature.properties as Trash);
      trashs.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });
      setTrashList(trashs);
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
      <div id="map-container" ref={mapContainerRef} className="map-container">
        {isSourceLoaded && <MapToolbar />}
        {isMapLoaded && <TrashLayer map={mapRef.current!} />}
        {zoom >= 12 && <ListPanel />}
        {zoom >= 12 && <Legend />}
        {currentCampagne && <ModalCampaign campaign={currentCampagne} />}
      </div>
    </div>
  );
};

export default MapApp;
