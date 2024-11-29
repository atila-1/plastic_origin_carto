import { useMapContext } from '@context/MapContext';
import { FadersHorizontal } from '@phosphor-icons/react';
import { Trash } from '@types';
import { getItem } from '@utils/indexedDB';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';

export const SliderMap = (): ReactElement => {
  const { mapBox } = useMapContext();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isSliderVisible, setIsSliderVisible] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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

  const startProgress = (): void => {
    if (!startDate || !endDate || isPlaying) return;
    setIsPlaying(true);
    setProgress(0);
    setCurrentDate(startDate);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const stepDuration = totalDuration / 100;
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setCurrentDate((prevDate) => {
          if (!prevDate) return null;
          const newDate = new Date(prevDate.getTime() + stepDuration);
          if (newDate >= endDate) {
            clearInterval(intervalRef.current!);
            setIsPlaying(false);
            return endDate;
          }
          return newDate;
        });

        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          if (newProgress >= 100) {
            clearInterval(intervalRef.current!);
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 150);

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
      source.setData(filteredData);
    };
    loadData();
  }, [currentDate, mapBox]);

  const handleIconClick = (): void => {
    setIsSliderVisible(!isSliderVisible);
    if (!isSliderVisible) {
      mapBox!.flyTo({
        center: [10.9, 46.1],
        zoom: 4.5
      });
    }
  }

  return (
    <div className="slider-toolbar">
      <button className="map-toolbar-button" onClick={handleIconClick}>
        <FadersHorizontal size={22} weight="bold" data-tooltip-id="tooltip-slider" data-tooltip-content="Cliquez pour afficher un slider temporel" />
      </button>
      <Tooltip id="tooltip-slider" />
      {isSliderVisible && (
        <div className="map-slider">
          <div className="slider-date date-start">
            <span>{startDate?.toLocaleDateString()}</span>
          </div>
          <div className="progress-bar-content">
            <div className='progress-bar'>
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <div className='progress-actions'>
              <button onClick={startProgress}>Commencer</button>
              <span>
                {currentDate?.toDateString()}
              </span>
            </div>
          </div>
          <div className="slider-date date-end">
            <span>{endDate?.toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};