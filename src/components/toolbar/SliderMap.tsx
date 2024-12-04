import { useMapContext } from '@context/MapContext';
import { useSlider } from '@hooks/useSlider';
import { FadersHorizontal } from '@phosphor-icons/react';
import { Trash } from '@types';
import { getItem } from '@utils/indexedDB';
import { ReactElement, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

export const SliderMap = (): ReactElement => {
  const { mapBox } = useMapContext();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { currentDate, progress, isPlaying, startProgress, resetProgress, pauseProgress } = useSlider(startDate, endDate);
  const [isSliderVisible, setIsSliderVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const originalData = await getItem<GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>>('trashData');
      originalData.features.sort((a, b) => {
        return new Date(a.properties.time).getTime() - new Date(b.properties.time).getTime();
      });
      const start = new Date(originalData.features[0].properties.time);
      const end = new Date(originalData.features[originalData.features.length - 1].properties.time);
      setStartDate(start);
      setEndDate(end);
    };
    fetchData();
  }, []);

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
      if (filteredData.features.length <= 10) return;
      source.setData(filteredData);
    };
    loadData();
  }, [mapBox, currentDate]);

  const handleIconClick = (): void => {
    setIsSliderVisible(!isSliderVisible);
    if (!isSliderVisible) {
      mapBox!.flyTo({
        center: [10.9, 46.1],
        zoom: 4.5,
      });
    }
  };

  const reset = async (): Promise<void> => {
    resetProgress();
    const originalData = await getItem<GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>>('trashData');
    const source = mapBox!.getSource('data') as mapboxgl.GeoJSONSource;
    source.setData(originalData);
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
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-actions">
              {!isPlaying && <button onClick={startProgress}>Commencer</button>}
              {isPlaying && <button onClick={pauseProgress}>Pause</button>}
              {progress > 1 && <button onClick={reset}>Reset</button>}
              <span>{currentDate?.toDateString()}</span>
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