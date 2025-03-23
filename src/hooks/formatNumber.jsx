
export const formatNumber = (number, decimals = 2) => {
    return number.toLocaleString('ro-RO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };