// import toast from '../utils/toast';
var _ = require('lodash');
import I18n from 'react-native-i18n';
let time;
var statusesFailed = (rejReason) => {
  switch (rejReason) {
    case 'FAILED':
      return 'Failed';
    case 100:
      return 'CANCELLEDSELFORDER';
    case 105:
      return 'IncorrectPrice';
    case 108:
      return 'AccountIsLiquidating';
    case 110:
      return 'MarginInsufficient';
    case 13:
      return 'IncorrectQuantity';
    case 109:
      return 'PositionExcceedsLimit';
    case 111:
      return 'ClOrdIDIsDuplicatedWithInToday';
    default:
      return 'Failed';
  }
};
const feebackReset = (that) => {
  that.orderFeedback = {
    tipSuccess: false,
    PendingNew: false,
    CanceledBySystem: false,
    Canceled: false,
    ReplacedSuccess: false,
    Filled: false,
    PartiallyFilled: false,
  };
};

const receiveInitExecReportData = (that, data) => {
  that.execReportData[data.OID] = data;
};

const receiveExecReportFeedback = (that, data) => {
  let old = {
    Status: null,
    CumQty: null,
    LeaveQty: null,
    Price: null,
    StopPrice: null,
  }
  //EaryProfit
  if (data.IsEarlyProfit) {
    // that.orderFeedback['tipSuccess'] = false;
    // that.orderFeedback = {};
    feebackReset(that);
    that.orderFeedback['EPA'] = true;
    that.execReportData[data.OID] = data;
    return;
  }
  //Liquidation
  if (data.IsLiquidation) {
    feebackReset(that);
    that.orderFeedback['Liquidation'] = true;
    that.execReportData[data.OID] = data;
    return;
  }

  old = that.execReportData[data.OID];
  // console.log(that, data, old, 'feedback');
  // New Order Placed
  if (_.isUndefined(old) && data.Status === "A") {
    feebackReset(that);
    that.orderFeedback['PendingNew'] = true;
    that.execReportData[data.OID] = data;
    return;
  };

  //Cancelled By System
  if (data.Status !== old.Status && data.Status === 'G') {
    feebackReset(that);
    that.orderFeedback['CanceledBySystem'] = true;
    that.execReportData[data.OID] = data;
    return;
  };

  //Cancelled
  if ((old.LeaveQty > 0) && (data.LeaveQty === 0) && (old.CumQty === data.CumQty)) {
    feebackReset(that);
    that.orderFeedback['Canceled'] = true;
    that.execReportData[data.OID] = data;
    return;
  };

  //Replaced
  if (((data.LeaveQty !== old.LeaveQty && data.CumQty === old.CumQty) || data.Price !== old.Price || data.StopPrice !== old.StopPrice)) {
    feebackReset(that);
    that.orderFeedback['ReplacedSuccess'] = true;
    that.execReportData[data.OID] = data;
    return;
  };

  //Filled
  if (data.LeaveQty === 0 && data.CumQty > old.CumQty) {
    feebackReset(that);
    that.orderFeedback['Filled'] = true;
    that.execReportData[data.OID] = data;
    // if($('#audio-execution').length!= 0){
    //    $('#audio-execution')[0].play();
    //  }
    return;
  };

  //PartiallyFilled
  if (data.LeaveQty > 0 && data.CumQty > old.CumQty) {
    feebackReset(that);
    that.orderFeedback['PartiallyFilled'] = true;
    that.execReportData[data.OID] = data;
    return;
  };
}

const receiveResponseFeedback = (that, data, rejReason) => {
  if (data.RC == "0") {
    if (data.MsgType == "PlaceOrderResponse") {
      return;
    }
    if (data.MsgType == "CancelReplaceOrderResponse") {
      return;
    }
    if (data.MsgType == "CancelOrderResponse") {
      return;
    }
  }
  if (data.RC != "0") {
    //do some response error stuff'
    that.orderFeedback[statusesFailed(rejReason)] = true;
    feebackReset(that);
    // toast(I18n.t('content_order_failed'), 3000, '#CC4227');
  }
}

const feedbackAlert = (that, scroll) => {
  clearTimeout(time);
  time = setTimeout(() => {
    // console.log('lastFeedback', that.orderFeedback);
    let types = that.orderFeedback;
    if (types['PendingNew']) {
      scroll();
      // toast(I18n.t('content_order_placed'), 3000, '#2CB350');
    } else if (types['CanceledBySystem']) {
      // toast(I18n.t('content_system_cancelled'), 3000, '#CC4227');
    } else if (types['Canceled']) {
      // toast(I18n.t('content_order_cancelled'), 3000, '#2CB350');
    } else if (types['ReplacedSuccess']) {
      // toast(I18n.t('content_order_replaced'), 3000, '#2CB350');
    } else if (types['Filled']) {
      // toast(I18n.t('content_order_filled'), 3000, '#2CB350');
    } else if (types['PartiallyFilled']) {
      // toast(I18n.t('content_order_partially_filled'), 3000, '#2CB350');
    }
  }, 100);
}

export default {
  receiveInitExecReportData,
  receiveExecReportFeedback,
  receiveResponseFeedback,
  feedbackAlert
}
