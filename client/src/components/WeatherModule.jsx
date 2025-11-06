import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherModule() {
  const [city, setCity] = useState('Hyderabad');
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (q) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/weather?q=${encodeURIComponent(q)}`);
      if (res.data.ok) setData(res.data.weather);
      else setError('Could not fetch weather');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          className="input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn" onClick={() => fetchWeather(city)}>
          Get
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {data && (
        <div>
          <h2>
            {data.city}
            {data.country ? `, ${data.country}` : ''}
          </h2>
          <div className="small">{data.description}</div>
          <div>
            <strong>{data.temperature}°C</strong> (feels like {data.feels_like}°C)
          </div>
        </div>
      )}
    </div>
  );
}
