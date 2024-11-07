import { useState } from 'react';
import { LocationPoint } from '../types';
type Suggestion = {
  name: string;
  mapbox_id: string;
};
type UseSearchSuggestionsReturn = {
  inputValue: string;
  suggestions: Suggestion[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectSuggestion: (mapboxId: string) => Promise<LocationPoint | null>;
};

const useSearchSuggestions = (sessionToken: string): UseSearchSuggestionsReturn => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_MAPBOX_API_URL}suggest?q=${value}&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&session_token=${sessionToken}`
        );
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = async (mapboxId: string): Promise<LocationPoint | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&session_token=${sessionToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        return data.features[0].properties;
      }
    } catch (error) {
      console.error('Error retrieving suggestion details:', error);
    }

    return null;
  };

  return { inputValue, suggestions, handleChange, selectSuggestion };
};

export default useSearchSuggestions;