
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
      const apiKey = process.env.REACT_APP_CURRENCY_API; // Înlocuiește cu cheia ta API
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      const exchangeRate = data.rates[toCurrency];
      return amount * exchangeRate;
    } catch (error) {
      console.error('Error converting currency:', error);
      return null;
    }
  };