import { plusCalculate, reduceCalculate, multipliedCalculate } from './calculate';
import { getCurrencyFromSymbol } from './currencySymbol';
var _ = require('lodash');


const getProfitByCurrency = (currency, positions) => {
  return _.sumBy(positions, (o) => {
    if (getCurrencyFromSymbol(o.S, true) == currency) {
      return o.totalProfit;
    }
    return 0;
  })
}
const getInitialMarginByCurrency = (currency, positions) => {
  let sum = 0;
  _.forEach(positions, (o) => {
    if (getCurrencyFromSymbol(o.S, true) == currency) {
      sum = plusCalculate(o.quoteInitialMargin, sum);
    } else if (getCurrencyFromSymbol(o.S, false) == currency) {
      sum = plusCalculate(o.baseInitialMargin, sum);
    }
  });
  return sum
}
const getInitialMarginRequired = (initialMargin, profit, side, initialMarginFactor) => {
  let volatileMargin = (side || profit >= 0) ? 0 : multipliedCalculate(profit, initialMarginFactor);
  return reduceCalculate(initialMargin, volatileMargin);
}
const calculateCurrentValuation = (lastPrice, openPosition) => {
  return multipliedCalculate(lastPrice, Math.abs(openPosition)) || 0;
};

export const updateBalances = (balances, positions) => {
  return balances = _.map(balances, (balance) => {
    let C;
    if (balance.C.toString().indexOf('.') > 0) {
      C = parseFloat(balance.C.toString().length) - parseFloat(balance.C.toString().indexOf('.') + 1) > 4 ? parseFloat(balance.C.toString().slice(0, -1)) : balance.C;
    } else {
      C = balance.C
    };
    balance.initialMargin = getInitialMarginByCurrency(balance.CR, positions);
    balance.totalProfit = getProfitByCurrency(balance.CR, positions);
    balance.totalEquity = plusCalculate(C, balance.totalProfit);
    let loss = balance.totalProfit < 0 ? balance.totalProfit : 0;
    balance.usableMargin = plusCalculate(reduceCalculate(C, balance.initialMargin), loss) < 0 ? 0 : plusCalculate(reduceCalculate(C, balance.initialMargin), loss)
    return balance;
  });
}

export const updatePositions = (positions, tickerAccount) => {
  return positions = _.map(positions, (position) => {
    let lastPrice = tickerAccount === null ? 0 : tickerAccount.Last;
    if (tickerAccount.Symbol !== position.S) {
      lastPrice = 0;
    }
    position.totalProfit = multipliedCalculate(position.OS, reduceCalculate(lastPrice, position.AP));
    position.marketValue = multipliedCalculate(Math.abs(position.OS), lastPrice);
    position.quoteInitialMargin = getInitialMarginRequired(position.QIMR, position.totalProfit, position.OS >= 0, position.IMF);
    position.baseInitialMargin = getInitialMarginRequired(position.BIMR, position.totalProfit, position.OS >= 0, position.IMF);
    position.liquidationPrice = position.LP;
    position.currentValuation = calculateCurrentValuation(lastPrice, 1);
    return position;
  });
}

export const sortNumber = (a, b) => {
  return a[0] - b[0];
}