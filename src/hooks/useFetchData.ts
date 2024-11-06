// import React, { useRef, useEffect, useState } from 'react';
import { GeoJSONFeature } from 'mapbox-gl';
import { useEffect, useState } from 'react';

type UseFetchDataReturn = {
  data: GeoJSONFeature;
  loading: boolean;
};

const useFetchData = (url: string): UseFetchDataReturn => {
  const [data, setData] = useState<GeoJSONFeature>(null!);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      console.log("Fetch", url)
      try {
        const response = await fetch(url).then(response => response.json())
        console.log("Fetch", response)
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(true);
      }
    }
    setLoading(true);
    fetchData();
  }, [url]);

  return { data, loading };
};

export default useFetchData;
