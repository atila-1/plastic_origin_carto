import { Map, MapMouseEvent } from 'mapbox-gl';
import { useEffect } from 'react';
import circleConfig from '../assets/TrashCircleStyle';
import heatmapConfig from '../assets/TrashHeatmapStyle';
import { useMapContext } from '../context/MapContext';
import useFetchData from '../hooks/useFetchData';
import { LocationPoint } from '../types';

interface TrashLayerProps {
  map: Map;
}
const TrashLayer = ({ map }: TrashLayerProps): null => {
  const { bounds, setLocationPoint } = useMapContext();
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

    const handlePointClick = (e: MapMouseEvent): void => {
      console.log(e.features);
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      setLocationPoint(feature.properties as unknown as LocationPoint);
    };


    map.on('click', 'circle_trash', handlePointClick);

    return () => {
      map.off('click', 'circle_trash', handlePointClick);
    };



  }, [data]);
  return null;
};

export default TrashLayer;
