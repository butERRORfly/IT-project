import React from 'react';
import { useState, useEffect } from 'react';

export const currencies = [
  { "code": "AUD", "name": "Australian Dollar" },
  { "code": "BGN", "name": "Bulgarian Lev" },
  { "code": "BRL", "name": "Brazilian Real" },
  { "code": "CAD", "name": "Canadian Dollar" },
  { "code": "CHF", "name": "Swiss Franc" },
  { "code": "CNY", "name": "Chinese Yuan" },
  { "code": "CZK", "name": "Czech Koruna" },
  { "code": "DKK", "name": "Danish Krone" },
  { "code": "EUR", "name": "Euro" },
  { "code": "GBP", "name": "British Pound Sterling" },
  { "code": "HKD", "name": "Hong Kong Dollar" },
  { "code": "HUF", "name": "Hungarian Forint" },
  { "code": "IDR", "name": "Indonesian Rupiah" },
  { "code": "ILS", "name": "Israeli New Shekel" },
  { "code": "INR", "name": "Indian Rupee" },
  { "code": "ISK", "name": "Icelandic Krona" },
  { "code": "JPY", "name": "Japanese Yen" },
  { "code": "KRW", "name": "South Korean Won" },
  { "code": "MXN", "name": "Mexican Peso" },
  { "code": "MYR", "name": "Malaysian Ringgit" },
  { "code": "NOK", "name": "Norwegian Krone" },
  { "code": "NZD", "name": "New Zealand Dollar" },
  { "code": "PHP", "name": "Philippine Peso" },
  { "code": "PLN", "name": "Polish Zloty" },
  { "code": "RON", "name": "Romanian Leu" },
  { "code": "SEK", "name": "Swedish Krona" },
  { "code": "SGD", "name": "Singapore Dollar" },
  { "code": "THB", "name": "Thai Baht" },
  { "code": "TRY", "name": "Turkish Lira" },
  { "code": "USD", "name": "United States Dollar" },
  { "code": "ZAR", "name": "South African Rand" }
];

export default function TotalPrice({ totalScore }) {
  const [isConverting, setIsConverting] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(totalScore);

  // Инициализация селекта (аналог change_rate)
  const handleCurrencyChange = async (e) => {
    const toCurrency = e.target.value;
    if (toCurrency === currentCurrency) return;

    setIsConverting(true);

    try {
      if (toCurrency === 'USD') {
        setConvertedAmount(totalScore);
      } else {
        const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${toCurrency}`);
        const data = await response.json();
        const rate = data.rates[toCurrency];
        setConvertedAmount((parseFloat(totalScore) * rate).toFixed(2));
      }
      setCurrentCurrency(toCurrency);
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  // Обновляем convertedAmount при изменении totalScore
  useEffect(() => {
    if (currentCurrency === 'USD') {
      setConvertedAmount(totalScore);
    } else {
      // Если валюта не USD, нужно переконвертировать
      fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${currentCurrency}`)
        .then(response => response.json())
        .then(data => {
          const rate = data.rates[currentCurrency];
          setConvertedAmount((parseFloat(totalScore) * rate).toFixed(2));
        })
        .catch(console.error);
    }
  }, [totalScore]);

  return (
    <div className="summ-price">
      <div>
        <span className="label">💵 Полная стоимость:</span>
        <p2 id="rater">{currentCurrency}</p2>
        <span id="summary" className="value">
          {isConverting ? 'Converting...' : convertedAmount}
        </span>
      </div>
      <select
        id="selector"
        className="select-container"
        onChange={handleCurrencyChange}
        value={currentCurrency}
        disabled={isConverting}
      >
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}