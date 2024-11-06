import { Map } from 'mapbox-gl';
import { useEffect } from 'react';
import circleConfig from '../assets/TrashCircleStyle';
import heatmapConfig from '../assets/TrashHeatmapStyle';
import { useMapContext } from '../context/MapContext';
import useFetchData from '../hooks/useFetchData';

interface TrashLayerProps {
  map: Map;
}
const TrashLayer = ({ map }: TrashLayerProps): null => {
  const { bounds } = useMapContext();
  const convertBoundsToUrl = (): string => {
    return bounds!.map((bound) => bound.toFixed(2)).join('/');
  }
  const url = `https://api-plastico-prod.azurewebsites.net/v1/geojson/${convertBoundsToUrl()}?entity_type=trash`;
  const { data, loading } = useFetchData(url);
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
        maxzoom: 15,
        paint: heatmapConfig as any
      });
    }

    if (!map.getLayer('circle_trash')) {
      map.addLayer({
        id: 'circle_trash',
        type: 'circle',
        source: 'data',
        minzoom: 13,
        layout: { visibility: 'visible' },
        paint: circleConfig as any
      });
    }

    // Adding a layer that makes non selected points greyish
    // if (!map.getLayer('circle_trash_background')) {
    //   map.addLayer({
    //     id: 'circle_trash_background',
    //     type: 'circle',
    //     source: 'data',
    //     minzoom: 13,
    //     paint: circleBackgroundConfig as any,
    //     layout: { visibility: 'none' }
    //   });
    // }

    // // Adding a layer that highlights points of the same campaign than the clicked point
    // if (!map.getLayer('circle_trash_highlight')) {
    //   map.addLayer({
    //     id: 'circle_trash_highlight',
    //     type: 'circle',
    //     source: 'data',
    //     minzoom: 13,
    //     paint: circleHighlightConfig as any,
    //     filter: ['==', 'id_ref_campaign_fk', '']
    //   });
    // }



  }, [data]);
  return null;
};

export default TrashLayer;
