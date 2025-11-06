import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const convert = async (amt) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/currency?amount=${amt}`);
      if (res.data.ok) setResult(res.data);
      else setError('Could not fetch conversion');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    convert(amount);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          className="input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn" onClick={() => convert(amount)}>
          Convert
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {result && (
        <div>
          <div className="small">INR {result.amountINR} ➜</div>
          <h3>USD {result.usd}</h3>
          <h3>EUR {result.eur}</h3>
          <div className="small">
            Rates snapshot: USD {result.rates.USD}, EUR {result.rates.EUR}
          </div>
        </div>
      )}
    </div>
  );
}
