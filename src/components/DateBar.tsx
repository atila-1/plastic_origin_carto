import { CalendarBlank } from '@phosphor-icons/react';
import { ReactElement, useState } from 'react';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";
import { useMapContext } from '../context/MapContext';
import { Trash } from '../types';
import { getItem } from '../types/services/indexedDB';

export default function DateBar(): ReactElement {
  const { mapBox } = useMapContext();
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState<Date>(null!);
  const [endDate, setEndDate] = useState<Date>(null!);

  const handleIconClick = (): void => {
    setShowDateInput(!showDateInput);
  };

  const onChange = (date: [Date | null, Date | null]): void => {
    if (!date || date.length !== 2) return;
    const [start, end] = date;
    setStartDate(start!);
    setEndDate(end!);


    const loadData = async (): Promise<void> => {
      const source = mapBox!.getSource('data') as mapboxgl.GeoJSONSource;
      if (source) {
        const originalData = await getItem<GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>>('trashData')
        // const originalData = source._data as GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>;
        console.log(originalData);
        const filteredFeatures = originalData.features.filter((feature) => {
          const featureDate = new Date(feature.properties.time);
          return featureDate >= start! && featureDate <= end!;
        });

        const filteredData: GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash> = {
          type: 'FeatureCollection',
          features: filteredFeatures,
        };
        console.log(filteredData);

        source.setData(filteredData);
      }
    }

    loadData();




  };

  return (
    <div className="map-toolbar date-toolbar">
      <button className="map-toolbar-button" onClick={handleIconClick}>
        <CalendarBlank size={22} weight="bold" />
      </button>
      {showDateInput && (
        <DatePicker
          swapRange
          selected={startDate}
          onChange={onChange}
          startDate={startDate!}
          endDate={endDate!}
          selectsRange
          inline
        />
      )}
    </div>
  );
}
