import { FeatureCollection } from "geojson";
import { Map, MapMouseEvent } from 'mapbox-gl';
import { useEffect, useState } from 'react';
import circleHighlightConfig from '../assets/TrashCircleHighlightStyle';
import circleConfig from '../assets/TrashCircleStyle';
import heatmapConfig from '../assets/TrashHeatmapStyle';
import { useMapContext } from '../context/MapContext';
import useFetchData from '../hooks/useFetchData';
import { Trash } from '../types';
import { getItem, setItem } from "../types/services/indexedDB";

interface TrashLayerProps {
  map: Map;
}
const TrashLayer = ({ map }: TrashLayerProps): null => {
  const { bounds, setSelectedTrash, setTrashListApi } = useMapContext();
  const url = `${import.meta.env.VITE_PLASTIC_API}/geojson/${bounds!.map(($) => $.toFixed(2)).join('/')}?entity_type=trash`;
  const [initialData, setInitialData] = useState<FeatureCollection | null>(null);
  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      const data = await getItem('trashData');
      setInitialData(data);
    };
    fetchInitialData();
  }, []);
  const { data, loading } = useFetchData<FeatureCollection>(url);
  useEffect(() => {
    let mapData = initialData;
    if (!loading && data) {
      mapData = data;
    }
    if (!mapData || !map) {
      console.warn(new Date().toISOString(), ' ==> no data or map');
      return;
    }

    setItem('trashData', mapData);
    console.log(new Date().toISOString(), " ==> Data map loaded successfully");
    const setType = (type: string): string => {
      if (type === "Sheet / tarp / plastic bag / fragment") {
        return "Trash"
      } else if (type === "Insulating material") {
        return "AccumulationZone"
      } else if (type === "Bottle-shaped") {
        return "BulkyTrash"
      }
      return type
    }

    mapData.features.forEach((feature) => {
      feature.properties!.type_name = setType(feature.properties!.type_name)
    });
    setTrashListApi(mapData.features.map((feature) => feature.properties as Trash));
    if (!map.getSource('data')) {
      map.addSource('data', {
        type: 'geojson',
        data: mapData
      });
    } else {
      console.log(new Date().toISOString(), " ==> Data map loaded successfully");
      const source: mapboxgl.GeoJSONSource = map.getSource('data') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(mapData);
      }
    }

    if (!map.getLayer('heatmap_trash')) {
      map.addLayer({
        id: 'heatmap_trash',
        type: 'heatmap',
        source: 'data',
        maxzoom: 14,
        paint: heatmapConfig as unknown as mapboxgl.HeatmapPaint
      });
    }

    if (!map.getLayer('circle_trash')) {
      map.addLayer({
        id: 'circle_trash',
        type: 'circle',
        source: 'data',
        minzoom: 12,
        layout: { visibility: 'visible' },
        paint: circleConfig as unknown as mapboxgl.HeatmapPaint
      });
    }

    // Adding a layer that makes non selected points greyish
    if (!map.getLayer('circle_trash_background')) {
      // map.addLayer({
      //   id: 'circle_trash_background',
      //   type: 'circle',
      //   source: 'data',
      //   minzoom: 12,
      //   paint: circleBackgroundConfig as unknown as mapboxgl.HeatmapPaint,
      //   layout: { visibility: 'none' }
      // });
    }

    if (!map.getLayer('circle_trash_highlight')) {
      map.addLayer({
        id: 'circle_trash_highlight',
        type: 'circle',
        source: 'data',
        minzoom: 12,
        paint: circleHighlightConfig as unknown as mapboxgl.HeatmapPaint,
        filter: ['==', 'id_ref_campaign_fk', '']
      });
    }

    const handlePointClick = (e: MapMouseEvent): void => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      setSelectedTrash(feature.properties as unknown as Trash);
    };

    const handleClickHeatmap = (e: MapMouseEvent): void => {
      const zoom = map.getZoom();
      let finalZoom = 0;
      if (zoom <= 5) {
        finalZoom = 10;
      } else if (zoom <= 8) {
        finalZoom = 12.5;
      } else {
        finalZoom = 15;
      }
      map.flyTo({
        center: e.lngLat,
        zoom: finalZoom
      });

    }
    map.on('click', 'circle_trash', handlePointClick);
    map.on('click', 'heatmap_trash', handleClickHeatmap);
    return (): void => {
      map.off('click', 'circle_trash', handlePointClick);
      map.off('click', 'heatmap_trash', handleClickHeatmap);
    };
  }, [data, initialData]);
  return null;
};

export default TrashLayer;
