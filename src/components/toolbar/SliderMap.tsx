import { useMapContext } from '@context/MapContext';
import { FadersHorizontal } from '@phosphor-icons/react';
import { Trash } from '@types';
import { getItem } from '@utils/indexedDB';
import { ReactElement, useEffect, useRef, useState } from 'react';

export const SliderMap = (): ReactElement => {
  const { mapBox } = useMapContext();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const originalData = await getItem<GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>>('trashData');
      originalData.features.sort((a, b) => {
        return new Date(a.properties.time).getTime() - new Date(b.properties.time).getTime();
      });
      const start = new Date(originalData.features[0].properties.time);
      const end = new Date(originalData.features[originalData.features.length - 1].properties.time);
      setStartDate(start);
      setEndDate(end);
      setCurrentDate(start);
    };

    fetchData();
  }, []);

  const startProgress = () => {
    if (!startDate || !endDate) return;

    const totalDuration = endDate.getTime() - startDate.getTime();
    const stepDuration = totalDuration / 100; // Dividir en 100 pasos para la barra de progreso

    intervalRef.current = setInterval(() => {
      setCurrentDate((prevDate) => {
        if (!prevDate) return null;
        const newDate = new Date(prevDate.getTime() + stepDuration);
        if (newDate >= endDate) {
          clearInterval(intervalRef.current!);
          return endDate;
        }
        return newDate;
      });

      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current!);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  useEffect(() => {
    if (!currentDate || !mapBox) return;
    const loadData = async (): Promise<void> => {
      const source = mapBox!.getSource('data') as mapboxgl.GeoJSONSource;
      if (!source) return;
      const originalData = await getItem<GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>>('trashData');
      const filteredFeatures = originalData.features.filter((feature) => {
        const featureDate = new Date(feature.properties.time);
        return featureDate <= currentDate;
      });

      const filteredData: GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash> = {
        type: 'FeatureCollection',
        features: filteredFeatures,
      };
      console.log('filteredData', filteredData.features.length);
      source.setData(filteredData);
    };
    loadData();
  }, [currentDate, mapBox]);

  const handleIconClick = (): void => {
    console.log('slider icon clicked');
  }

  return (
    <div className="slider-toolbar">
      <button className="map-toolbar-button" onClick={handleIconClick}>
        <FadersHorizontal size={22} weight="bold" />
      </button>
      <div className="map-slider">
        <div className="slider-date date-start">
          <span>{startDate?.toDateString()}</span>
        </div>
        <button onClick={startProgress}>Iniciar</button>
        {currentDate?.toDateString()}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="slider-date date-end">
          <span>{endDate?.toDateString()}</span>
        </div>
      </div>
    </div>
  );
};