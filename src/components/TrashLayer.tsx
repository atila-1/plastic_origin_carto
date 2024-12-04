import { FeatureCollection } from "geojson";
import { MapMouseEvent, Marker } from 'mapbox-gl';
import { useEffect, useState } from 'react';
import circleHighlightConfig from '../assets/TrashCircleHighlightStyle';
import circleConfig from '../assets/TrashCircleStyle';
import heatmapConfig from '../assets/TrashHeatmapStyle';
import { useMapContext } from '../context/MapContext';
import useFetchData from '../hooks/useFetchData';
import { Trash } from '../types';
import { getItem, setItem } from "../utils/indexedDB";


const TrashLayer = (): null => {
  const { bounds, setSelectedTrash, setTrashListApi, mapBox, setIsAppReady } = useMapContext();
  const url = `${import.meta.env.VITE_PLASTIC_API}/geojson/${bounds!.map(($) => $.toFixed(2)).join('/')}?entity_type=trash`;
  const [initialData, setInitialData] = useState<FeatureCollection | null>(null);
  const { data, loading } = useFetchData<FeatureCollection>(url);

  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      const $data = await getItem<GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>>('trashData');
      setInitialData($data);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!mapBox || mapBox.loaded() === false) {
      console.warn(new Date().toISOString(), ' ==> no map');
      return;
    }
    let mapData = initialData;
    if (!loading && data) {
      mapData = data;
      setIsAppReady(true);
    }
    if (!mapData || !mapBox) {
      console.warn(new Date().toISOString(), ' ==> no data or map');
      return;
    }
    setItem('trashData', mapData);
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
    if (!mapBox.getSource('data')) {
      mapBox.addSource('data', {
        type: 'geojson',
        data: mapData
      });
    } else {
      console.log(new Date().toISOString(), " ==> Data map loaded successfully");
      const source: mapboxgl.GeoJSONSource = mapBox.getSource('data') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(mapData);
      }
    }

    if (!mapBox.getLayer('heatmap_trash')) {
      mapBox.addLayer({
        id: 'heatmap_trash',
        type: 'heatmap',
        source: 'data',
        maxzoom: 14,
        paint: heatmapConfig as unknown as mapboxgl.HeatmapPaint
      });
    }

    if (!mapBox.getLayer('circle_trash')) {
      mapBox.addLayer({
        id: 'circle_trash',
        type: 'circle',
        source: 'data',
        minzoom: 12,
        layout: { visibility: 'visible' },
        paint: circleConfig as unknown as mapboxgl.HeatmapPaint
      });
    }

    if (!mapBox.getLayer('circle_trash_highlight')) {
      mapBox.addLayer({
        id: 'circle_trash_highlight',
        type: 'circle',
        source: 'data',
        minzoom: 12,
        paint: circleHighlightConfig as unknown as mapboxgl.HeatmapPaint,
        filter: ['==', 'id_ref_campaign_fk', '']
      });
    }

    let marker: Marker | null = null;
    const handlePointClick = (e: MapMouseEvent): void => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      setSelectedTrash(feature.properties as unknown as Trash);

      mapBox._markers.forEach((marker) => {
        marker.remove();
      });
      const coordinates = (feature.geometry as any).coordinates.slice();
      marker = new Marker()
        .setLngLat(coordinates)
        .addTo(mapBox);

    };

    const handleClickHeatmap = (e: MapMouseEvent): void => {
      const zoom = mapBox.getZoom();
      let finalZoom = 0;
      if (zoom <= 5) {
        finalZoom = 10;
      } else if (zoom <= 8) {
        finalZoom = 12.5;
      } else {
        finalZoom = 15;
      }
      mapBox.flyTo({
        center: e.lngLat,
        zoom: finalZoom
      });

    }
    mapBox.on('click', 'circle_trash', handlePointClick);
    mapBox.on('click', 'circle_trash_highlight', handlePointClick);
    mapBox.on('click', 'heatmap_trash', handleClickHeatmap);
    return (): void => {
      mapBox.off('click', 'circle_trash', handlePointClick);
      mapBox.off('click', 'circle_trash_highlight', handlePointClick);
      mapBox.off('click', 'heatmap_trash', handleClickHeatmap);
    };
  }, [data, initialData, mapBox]);
  return null;
};

export default TrashLayer;
