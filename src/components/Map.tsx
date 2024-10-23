import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import TrashLayer from './TrashLayer';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapToolbar from './MapToolbar';
const MapApp = () => {
  const mapContainerRef = useRef<HTMLElement>();
  const mapRef = useRef<Map>();
  const [lng, setLng] = useState(2.1); // -1.0
  const [lat, setLat] = useState(46.1); // 43.47
  const [zoom, setZoom] = useState(5); // 14
  const isMapLoaded = useRef(false);
  // const url ="https://api-dev-plastico.westeurope.cloudapp.azure.com/v1/geojson/-2.0/43.0/-0.5/44.0?entity_type=trash" 
  const url ="https://api-plastico-prod.azurewebsites.net/v1/geojson/-3.0/40.0/3.0/50.0?entity_type=campaign" 
  useEffect(() => {
    console.log('useEffect...')
    mapboxgl.accessToken = "pk.eyJ1IjoiY2hvc2Vuc291bHMiLCJhIjoiY2s4ZTlteTN4MTQyZTNocXBqdXluM2c2dCJ9.iGBZLUChDBUlCqyOtDeCaw"
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/atila01/clxcyiurt00uf01qs2pejaygq',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 4,
      pitch:0,
      bearing:0
    });

    mapRef.current.addControl(new mapboxgl.FullscreenControl());
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    mapRef.current.on("load", () => {
      isMapLoaded.current = true;
      console.log(isMapLoaded.current)
      mapRef.current!.resize();
    });

    return () => {
      mapRef.current!.remove();
    };
  },[]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on('move', () => {
      setLng(+mapRef.current!.getCenter().lng.toFixed(4));
      setLat(+mapRef.current!.getCenter().lat.toFixed(4));
      setZoom(+mapRef.current!.getZoom().toFixed(2));
    });
  }, [mapRef]);

  return (
    <div className='relative'>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div id='map-container' ref={mapContainerRef} className="map-container" />
      <TrashLayer url={url} map={mapRef.current} /> {/*  zoom={zoom} isMapLoaded = {isMapLoaded.current}/> */}
      <MapToolbar />
    </div>
  );
};

export default MapApp;