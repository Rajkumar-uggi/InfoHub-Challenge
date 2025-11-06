require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const quotes = require('./quotes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Helper: Kelvin -> Celsius rounded to 1 decimal
function kelvinToCelsius(k) {
  return Math.round((k - 273.15) * 10) / 10;
}

// Quote route: returns a random quote from local array
app.get('/api/quote', (req, res) => {
  try {
    const idx = Math.floor(Math.random() * quotes.length);
    res.json({ ok: true, quote: quotes[idx] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Could not fetch quote.' });
  }
});

// Weather route: /api/weather?q=CityName  (default: London)
// Uses OpenWeatherMap -- requires OPENWEATHER_API_KEY in .env
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.q || 'Hyderabad';
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ ok: false, error: 'OpenWeather API key not configured.' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    const simplified = {
      city: data.name,
      country: data.sys?.country || null,
      temperature: kelvinToCelsius(data.main.temp),
      feels_like: kelvinToCelsius(data.main.feels_like),
      description: data.weather && data.weather[0] ? data.weather[0].description : null,
    };

    res.json({ ok: true, weather: simplified });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ ok: false, error: 'Could not fetch weather data.' });
  }
});

// Currency route: /api/currency?amount=100  (amount in INR)
app.get('/api/currency', async (req, res) => {
  const amount = Number(req.query.amount) || 100;
  const axiosInstance = axios.create({ timeout: 8000 });

  // fallback static rates if external APIs fail
  const fallbackRates = { USD: 0.012, EUR: 0.011 };

  try {
    // Frankfurter endpoint: returns rates relative to `from`
    const url = `https://api.frankfurter.app/latest?from=INR&to=USD,EUR`;
    const r = await axiosInstance.get(url);

    // expected shape: { amount:1, base:"INR", date:"YYYY-MM-DD", rates: { USD: x, EUR: y } }
    if (!r?.data?.rates || r.data.rates.USD == null || r.data.rates.EUR == null) {
      console.error('Frankfurter returned unexpected shape:', JSON.stringify(r?.data).slice(0, 2000));
      throw new Error('Frankfurter bad shape');
    }

    const rates = r.data.rates;
    const usd = Math.round((amount * rates.USD) * 100) / 100;
    const eur = Math.round((amount * rates.EUR) * 100) / 100;

    return res.json({
      ok: true,
      amountINR: amount,
      usd,
      eur,
      rates
    });
  } catch (err) {
    console.error('Currency endpoint error (Frankfurter):', err?.message || err);

    // fallback response so UI still shows values
    const usd = Math.round((amount * fallbackRates.USD) * 100) / 100;
    const eur = Math.round((amount * fallbackRates.EUR) * 100) / 100;

    return res.status(200).json({
      ok: false,
      error: 'Could not fetch currency data from external API. Returning fallback values.',
      amountINR: amount,
      usd,
      eur,
      rates: fallbackRates
    });
  }
});




app.get('/', (req, res) => res.send('InfoHub API running'));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
