import { MagnifyingGlass } from '@phosphor-icons/react';
import { Map } from 'mapbox-gl';
import { ReactElement, useEffect, useState } from 'react';
import useSearchSuggestions from '../hooks/useSearchSuggestions';

interface MyButtonProps {
  map: Map;
}

const SearchBar = ({ map }: MyButtonProps): ReactElement => {
  const [showInput, setShowInput] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const { inputValue, suggestions, handleChange, selectSuggestion } = useSearchSuggestions(sessionToken);
  const handleMouseEnter = (): void => {
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

  const handleSuggestionClick = async (mapboxId: string) => {
    const coordinates = await selectSuggestion(mapboxId);
    if (!coordinates) return;
    map.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: 10
    });
  };

  return (
    <>
      <div className="map-toolbar search-toolbar" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <button className="map-toolbar-button">
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
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion.mapbox_id)}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchBar;
