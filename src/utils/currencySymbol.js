const SYMBOLS = {
  XBTCNY: "XBTCNY",
  XBTUSD: "XBTUSD",
  XLTCNY: "XLTCNY",
  BTCCNY: "BTCCNY",
  BTCUSD: "BTCUSD"
}
const CURRENCIES = {
  BTC: "BTC",
  LTC: "LTC",
  USD: "USD",
  CNY: "CNY"
}
export const getCurrencyFromSymbol = (symbol, isQuote) => {
  if (isQuote) {
    switch (symbol) {
      case SYMBOLS.XBTCNY:
        return CURRENCIES.CNY;
      case SYMBOLS.XLTCNY:
        return CURRENCIES.CNY;
      case SYMBOLS.XBTUSD:
        return CURRENCIES.USD;
      case SYMBOLS.BTCCNY:
        return CURRENCIES.CNY;
      case SYMBOLS.BTCUSD:
        return CURRENCIES.USD;
      default:
        return symbol.substring(symbol.length - 3);
    }
  }
  else {
    switch (symbol) {
      case SYMBOLS.XBTCNY:
        return CURRENCIES.BTC;
      case SYMBOLS.XLTCNY:
        return CURRENCIES.LTC;
      case SYMBOLS.XBTUSD:
        return CURRENCIES.BTC;
      case SYMBOLS.BTCCNY:
        return CURRENCIES.BTC;
      case SYMBOLS.BTCUSD:
        return CURRENCIES.BTC
      default:
        return symbol.substring(symbol.length - 3);
    }
  }
}