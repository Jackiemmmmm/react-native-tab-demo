
var _ = require('lodash');
import { plusCalculate, dividedCalculate, multipliedCalculate } from './calculate';
import Format from '../utils/format';

const processIncoming = (that, data, bol) => {
  if (_.isEmpty(data)) {
    return;
  }
  if (data.LeaveQty > 0) {
    // if (data.OrderType == 'Z') {
    // if (!bol) {
    //   that.OCOPendingOrders[data.OID] = data;
    //   that.OCOPendingOrders[data.OID].TotalQty = plusCalculate(data.CumQty, data.LeaveQty);
    // } else {
    //   let old = that.OCOPendingOrders;
    //   that.OCOPendingOrders = {};
    // that.OCOPendingOrders[data.OID] = data;
    // that.OCOPendingOrders[data.OID].TotalQty = plusCalculate(data.CumQty, data.LeaveQty);
    // Object.assign(that.OCOPendingOrders, old);
    // }
    // } else {
    // if (!bol) {
    //   that.pendingOrders[data.OID] = data;
    //   that.pendingOrders[data.OID].TotalQty = plusCalculate(data.CumQty, data.LeaveQty);
    // } else {
    //   let old = that.pendingOrders;
    //   that.pendingOrders = {};
    that.pendingOrders[data.OID] = data;
    that.pendingOrders[data.OID].TotalQty = plusCalculate(data.CumQty, data.LeaveQty);
    // Object.assign(that.pendingOrders, old);
    // }
    // }
  }

  if (data.LeaveQty <= 0) {
    // if (data.OrderType == 'Z') {
    //   delete that.OCOPendingOrders[data.OID];
    // } else {
    delete that.pendingOrders[data.OID];
    // }
  }

  if (data.CumQty > 0) {
    data.UserAveragePrice = getUserAveragePrice(data);
    data.ExecutionTimeStamp = getExecutionTimeStamp(data);
    // if (!bol) {
    //   that.executionOrders[data.OID] = data;
    // } else {
    //   let old = that.executionOrders;
    // that.executionOrders = {};
    that.executionOrders[data.OID] = data;
    // Object.assign(that.executionOrders, old);
    // }
  }

  if (data.ExecutionDetails.length != 0) {
    data.ExecutionDetails.forEach(function (o, index) {
      if (o.OpenedQuantity != 0) {
        o.Symbol = data.Symbol;
        o.Side = data.Side;
        o.OpenPosition = (data.Side == '1') ? o.OpenedQuantity : -o.OpenedQuantity;
        // o.Profit = calculateProfit(ExecTrade.tradeList[0].Price,data.Price,data.Side,o.OpenedQuantity);
        that.positionDetails[data.OID + index] = o;
        return;
      }
      if (o.OpenedQuantity == 0) {
        delete that.positionDetails[data.OID + index];
      }
    });
  }
  that.oldExecReportData[data.OID] = data;
}

const getUserAveragePrice = (exec) => {
  var orderQuantity = _.sumBy(exec.ExecutionDetails, 'TotalQuantity');
  var averagePerExec = _.map(exec.ExecutionDetails, function (detail) {
    var weight = dividedCalculate(detail.TotalQuantity, orderQuantity);
    return multipliedCalculate(weight, detail.Price);
  });
  var UserAveragePrice = _.sum(averagePerExec);
  return UserAveragePrice;
};

const getExecutionTimeStamp = (exec) => {
  var details = _.get(exec, 'ExecutionDetails', []);
  var ExecutionTimeStamp = _.get(_.last(details), 'Timestamp');
  return ExecutionTimeStamp;
};

export default processIncoming
