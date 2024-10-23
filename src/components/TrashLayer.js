import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import useFetchData from './FetchData';
import heatmapConfig from '../assets/TrashHeatmapStyle';
import circleConfig from '../assets/TrashCircleStyle';
import circleHighlightConfig from '../assets/TrashCircleHighlightStyle';
import circleBackgroundConfig from '../assets/TrashCircleBackgroundStyle';
import { getTypeName } from '../assets/TypeId';

const TrashLayer = props => {
  const [data, loading] = useFetchData(props.url);

  
  useEffect(() => {
    if (!data || !props.map)  return ;

    console.log(data)
  
    // Adding source
    if(!props.map.getSource('data')){
      props.map.addSource("data", {
        "type": "geojson",
        "data": data
      });
    } else {
      props.map.getSource('data').setData(data);
    }
  
    // Adding heatmap layer
    if (!props.map.getLayer('heatmap_trash')) {
      props.map.addLayer({
        "id": "heatmap_trash",
        "type": "heatmap",
        "source": "data",
        "maxzoom": 17,
        "paint": heatmapConfig
      });
    }

    // Adding points layer
    if (!props.map.getLayer('circle_trash')) {
      props.map.addLayer({
        "id": "circle_trash",
        "type": "circle",
        "source": "data",
        "minzoom":13,
        'layout': {'visibility': 'visible'},
        "paint": circleConfig
      });
    }

    // Adding a layer that makes non selected points greyish
    if (!props.map.getLayer('circle_trash_background')) {
      props.map.addLayer({
        "id": "circle_trash_background",
        "type": "circle",
        "source": "data",
        "minzoom":13,
        "paint": circleBackgroundConfig,
        'layout': {'visibility': 'none'},
      });
    }

    // Adding a layer that highlights points of the same campaign than the clicked point
    if (!props.map.getLayer('circle_trash_highlight')) {
      props.map.addLayer({
        "id": "circle_trash_highlight",
        "type": "circle",
        "source": "data",
        "minzoom":13,
        "paint": circleHighlightConfig,
        'filter': ['==', 'id_ref_campaign_fk', '']
      });
    }

    const removeClickEffects = (map) => {
      // Remove the popup
      // if (map.getPopup()) {
      //   map.getPopup().remove();
      // }
      // Reset the filters and visibility of the layers
      map.setFilter('circle_trash_highlight', ['==', 'id_ref_campaign_fk', '']);
      map.setLayoutProperty('circle_trash_background', 'visibility', 'none');
    };

    // Adding effects on click
    props.map.on('click', 'circle_trash', (event) => {
      const typeName = getTypeName(event.features[0].properties.type_id);
      new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>ID:</strong> ${event.features[0].properties.id}
        <p><strong>Campaign: </strong>${event.features[0].properties.id_ref_campaign_fk}</p>
        <p><strong>Type: </strong>${typeName}</p>
        <p><strong>Date: </strong>${event.features[0].properties.time}</p>
        <p><strong>River: </strong>${event.features[0].properties.river_name}</p>
        `)
        .addTo(props.map);

      const clickedCampaign = event.features[0].properties.id_ref_campaign_fk ;      
      props.map.setFilter('circle_trash_highlight', [
        '==',
        'id_ref_campaign_fk',
        clickedCampaign
        ]);
      
      props.map.setLayoutProperty('circle_trash_background', 'visibility', 'visible');
    });

    // Removing effects
    props.map.off( () => {
      console.log('removing')
      removeClickEffects(props.map);
    });

  }, [data, props.map]); //, loading, props.isMapLoaded]);

  return null;
};

export default TrashLayer;

