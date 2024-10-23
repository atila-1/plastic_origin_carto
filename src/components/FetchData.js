import React, { useRef, useEffect, useState } from 'react';

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  return [data, loading];
};

export default useFetchData;
