import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';

const ProtectedComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/protected-route');
        setData(response.data);
      } catch (err) {
        setError('Unauthorized or Token expired');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data ? <div>{data.message}</div> : <p>{error}</p>}
    </div>
  );
};

export default ProtectedComponent;