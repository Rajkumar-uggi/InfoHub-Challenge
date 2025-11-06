import React from 'react';
import WeatherModule from './components/WeatherModule';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator';

export default function App() {
  return (
    <div className="container">
      {/* Header */}
      <header className="header center-header">
        <h1>InfoHub</h1>
        <p className="subtitle">Weather • Currency • Motivational Quotes</p>
      </header>

      {/* Three cards side by side */}
      <main className="module-row">
        <section className="module-card module-weather">
          <div className="module-header">
            <div className="module-icon">☁️</div>
            <div>
              <div className="module-title">Weather</div>
              <div className="small">Current temperature & conditions</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <WeatherModule />
          </div>
        </section>

        <section className="module-card module-currency">
          <div className="module-header">
            <div className="module-icon">💱</div>
            <div>
              <div className="module-title">Currency</div>
              <div className="small">Convert INR → USD / EUR</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <CurrencyConverter />
          </div>
        </section>

        <section className="module-card module-quote">
          <div className="module-header">
            <div className="module-icon">💬</div>
            <div>
              <div className="module-title">Quote</div>
              <div className="small">Motivational quotes</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <QuoteGenerator />
          </div>
        </section>
      </main>
    </div>
  );
}
