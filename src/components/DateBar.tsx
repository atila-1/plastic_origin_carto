import { CalendarBlank } from '@phosphor-icons/react';
import { ReactElement } from 'react';

export default function DateBar(): ReactElement {
  return (
    <div className="map-toolbar date-toolbar">
      <button className="map-toolbar-button">
        <CalendarBlank size={20} weight="bold" />
      </button>
    </div>
  );
}
