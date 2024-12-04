import { useMapContext } from '@context/MapContext';
import { CalendarBlank, Trash as TrashIcon } from '@phosphor-icons/react';
import { Trash } from '@types';
import { getItem } from '@utils/indexedDB';
import { ReactElement, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
    console.log(start, end);
    setStartDate(start!);
    setEndDate(end!);
    if (start && end) {
      setShowDateInput(false);
    }


    const loadData = async (): Promise<void> => {
      const source = mapBox!.getSource('data') as mapboxgl.GeoJSONSource;
      if (source) {
        const originalData = await getItem<GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>>('trashData')
        const filteredFeatures = originalData.features.filter((feature) => {
          const featureDate = new Date(feature.properties.time);
          return featureDate >= start! && featureDate <= end!;
        });
        const filteredData: GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash> = {
          type: 'FeatureCollection',
          features: filteredFeatures,
        };
        source.setData(filteredData);
      }
    }
    loadData();
  };

  const resetFilters = async (): Promise<void> => {
    setStartDate(null!);
    setEndDate(null!);
    setShowDateInput(true);
    const originalData = await getItem<GeoJSON.FeatureCollection<GeoJSON.Geometry, Trash>>('trashData')
    const source = mapBox!.getSource('data') as mapboxgl.GeoJSONSource;
    source.setData(originalData);
  }

  return (
    <div className="date-toolbar">
      <button className="map-toolbar-button" onClick={handleIconClick}>
        <CalendarBlank size={22} weight="bold" />
      </button>
      <div className='date-picker'>
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
      {
        startDate && endDate && (
          <div className="selected-date" onClick={resetFilters}>
            <span>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </span>
            <TrashIcon size={18} weight="bold" />
          </div>
        )
      }
    </div>
  );
}
