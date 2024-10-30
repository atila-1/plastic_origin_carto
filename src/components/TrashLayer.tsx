import { Map } from 'mapbox-gl';
import { useEffect } from 'react';
import heatmapConfig from '../assets/TrashHeatmapStyle';
import useFetchData from '../hooks/useFetchData';

interface TrashLayerProps {
  map: Map;
}
const TrashLayer = ({ map }: TrashLayerProps): null => {
  const url = 'https://api-plastico-prod.azurewebsites.net/v1/geojson/-3.0/40.0/3.0/50.0?entity_type=campaign';
  const { data, loading } = useFetchData(url);
  useEffect(() => {
    if (!data || !map) return;
    if (!map.getSource('data')) {
      map.addSource('data', {
        type: 'geojson',
        data: data
      });
    } else {
      // map.getSource('data')!.setData(data);
    }

    // Adding heatmap layer
    if (!map.getLayer('heatmap_trash')) {
      map.addLayer({
        id: 'heatmap_trash',
        type: 'heatmap',
        source: 'data',
        maxzoom: 17,
        paint: heatmapConfig as any
      });
    }
  }, [data, map]);
  return null;
};

export default TrashLayer;
