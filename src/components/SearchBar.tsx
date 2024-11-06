import { MagnifyingGlass, XCircle } from '@phosphor-icons/react';
import { Map } from 'mapbox-gl';
import { ReactElement, useEffect, useState } from 'react';
import { useMapContext } from '../context/MapContext';
import useSearchSuggestions from '../hooks/useSearchSuggestions';

interface MyButtonProps {
  map: Map;
}

const SearchBar = ({ map }: MyButtonProps): ReactElement => {
  const { setBounds } = useMapContext();
  const [showInput, setShowInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('Pays de la Loire');
  const [sessionToken, setSessionToken] = useState('');
  const { inputValue, suggestions, handleChange, selectSuggestion } = useSearchSuggestions(sessionToken);

  const handleMouseEnter = (): void => {
    if (selectedSuggestion) {
      return
    }

    setShowInput(true);
  };

  const handleMouseLeave = (): void => {
    if (!isFocused && inputValue === '') {
      setShowInput(false);
    }
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    if (inputValue === '') {
      setShowInput(false);
    }
  };

  useEffect(() => {
    const generateSessionToken = (): string => {
      return Math.random().toString(36).substring(2);
    };
    setSessionToken(generateSessionToken());
  }, []);

  const handleSuggestionClick = async (mapbox: any): Promise<void> => {
    const locationDetail = await selectSuggestion(mapbox.mapbox_id);
    if (!locationDetail) return;
    console.log(locationDetail);
    map.flyTo({
      center: [locationDetail.coordinates.longitude, locationDetail.coordinates.latitude],
      zoom: 10
    });
    setShowInput(false);
    setSelectedSuggestion(mapbox.name);
    setTimeout(() => {
      const bounds = map.getBounds();
      setBounds(bounds!.toArray().flat() as any);
    }, 1000);
  };

  const clearSelectedSuggestion = (): void => {
    setSelectedSuggestion('');
  };

  return (
    <>
      <div className="map-toolbar search-toolbar" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <button className="map-toolbar-button" onClick={() => { setShowInput(true); clearSelectedSuggestion() }}>
          <MagnifyingGlass size={20} weight="bold" />
        </button>
        <input
          type="text"
          placeholder="Rechercher une ville, une region, un pays..."
          className={`search-input ${showInput ? 'show' : ''}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={inputValue}
        />
        {suggestions.length > 0 && showInput && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}

        {selectedSuggestion && (
          <div className="selected-suggestion">
            <span>{selectedSuggestion}</span>
            <XCircle size={24} weight="fill" className="btn-clear" onClick={clearSelectedSuggestion} />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
