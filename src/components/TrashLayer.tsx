import { GeoJSONFeature, Map, MapMouseEvent } from 'mapbox-gl';
import { useEffect } from 'react';
import circleBackgroundConfig from '../assets/TrashCircleBackgroundStyle';
import circleHighlightConfig from '../assets/TrashCircleHighlightStyle';
import circleConfig from '../assets/TrashCircleStyle';
import heatmapConfig from '../assets/TrashHeatmapStyle';
import { useMapContext } from '../context/MapContext';
import useFetchData from '../hooks/useFetchData';
import { Trash } from '../types';

interface TrashLayerProps {
  map: Map;
}
const TrashLayer = ({ map }: TrashLayerProps): null => {
  const { bounds, setSelectedTrash } = useMapContext();
  const convertBoundsToUrl = (): string => {
    return bounds!.map((bound) => bound.toFixed(2)).join('/');
  }
  const url = `${import.meta.env.VITE_PLASTIC_API}/geojson/${convertBoundsToUrl()}?entity_type=trash`;
  const { data, loading } = useFetchData<GeoJSONFeature>(url);

  useEffect(() => {
    if (!data || !map) return;
    if (!map.getSource('data')) {
      map.addSource('data', {
        type: 'geojson',
        data: data
      });
    } else {
      const source: mapboxgl.GeoJSONSource = map.getSource('data') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(data);
      }
    }

    // Adding heatmap layer
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
        minzoom: 14,
        layout: { visibility: 'visible' },
        paint: circleConfig as unknown as mapboxgl.HeatmapPaint
      });
    }

    // Adding a layer that makes non selected points greyish
    if (!map.getLayer('circle_trash_background')) {
      map.addLayer({
        id: 'circle_trash_background',
        type: 'circle',
        source: 'data',
        minzoom: 13,
        paint: circleBackgroundConfig as any,
        layout: { visibility: 'none' }
      });
    }

    // // Adding a layer that highlights points of the same campaign than the clicked point
    if (!map.getLayer('circle_trash_highlight')) {
      map.addLayer({
        id: 'circle_trash_highlight',
        type: 'circle',
        source: 'data',
        minzoom: 13,
        paint: circleHighlightConfig as any,
        filter: ['==', 'id_ref_campaign_fk', '']
      });
    }

    const handlePointClick = (e: MapMouseEvent): void => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      setSelectedTrash(feature.properties as unknown as Trash);
    };


    map.on('click', 'circle_trash', handlePointClick);

    return (): void => {
      map.off('click', 'circle_trash', handlePointClick);
    };
  }, [data]);
  return null;
};

export default TrashLayer;
