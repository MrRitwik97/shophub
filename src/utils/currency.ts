// Currency utility functions for Indian Rupees
export const formatIndianCurrency = (amount: number): string => {
  // Convert to Indian number format with proper comma placement
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

// Alternative manual formatting for more control
export const formatIndianCurrencyManual = (amount: number): string => {
  const roundedAmount = Math.round(amount * 100) / 100;
  const [integerPart, decimalPart] = roundedAmount.toString().split('.');
  
  // Indian number formatting: last 3 digits, then groups of 2
  let formattedInteger = '';
  const reversedInteger = integerPart.split('').reverse().join('');
  
  for (let i = 0; i < reversedInteger.length; i++) {
    if (i === 3) {
      formattedInteger = ',' + formattedInteger;
    } else if (i > 3 && (i - 3) % 2 === 0) {
      formattedInteger = ',' + formattedInteger;
    }
    formattedInteger = reversedInteger[i] + formattedInteger;
  }
  
  const formatted = decimalPart ? `${formattedInteger}.${decimalPart.padEnd(2, '0')}` : formattedInteger;
  return `₹${formatted}`;
};

// Parse currency string back to number
export const parseIndianCurrency = (currencyString: string): number => {
  return parseFloat(currencyString.replace(/[₹,]/g, ''));
};

// Format for input fields (without currency symbol)
export const formatCurrencyInput = (amount: number): string => {
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};