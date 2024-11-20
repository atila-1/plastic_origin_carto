// import React, { useRef, useEffect, useState } from 'react';
import { useEffect, useState } from 'react';

type UseFetchDataReturn<T> = {
  data: T;
  loading: boolean;
};

const useFetchData = <T>(url: string): UseFetchDataReturn<T> => {
  const [data, setData] = useState<T>(null!);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch(url).then(response => response.json())
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [url]);

  return { data, loading };
};

export default useFetchData;
