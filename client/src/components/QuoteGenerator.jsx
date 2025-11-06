import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/quote');
      if (res.data.ok) setQuote(res.data.quote);
      else setError('Could not fetch quote');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button className="btn" onClick={fetchQuote}>
          New Quote
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {quote && (
        <blockquote>
          <p style={{ fontSize: '1.1rem', margin: '8px 0' }}>{quote.text}</p>
          <div className="small">— {quote.author || 'Unknown'}</div>
        </blockquote>
      )}
    </div>
  );
}
