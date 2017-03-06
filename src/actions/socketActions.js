
let _ = require('lodash');
import Sort from '../utils/sortOrderBook';
import ExecReport from '../utils/tradeExceReport';
import Feedback from '../utils/feedback';
import {
  AsyncStorage
} from 'react-native';

let ticker = null, LCCR, SCCR, BPI, PBM, _orderBookItemLength = 6,
  _FeedbackObj = {
    execReportData: {},
    orderFeedback: {
      tipSuccess: false,
      PendingNew: false,
      CanceledBySystem: false,
      Canceled: false,
      ReplacedSuccess: false,
      Filled: false,
      PartiallyFilled: false,
    }
  },
  _ExecReportObj = {
    pendingOrders: {},
    OCOPendingOrders: {},
    executionOrders: {},
    positionDetails: {},
    oldExecReportData: {}
  },
  _OrderBook = { askData: {}, bidData: {}, version: 0 }, _depth = 'OFF', lastPrice = '-';

export const getWs = (type, resp) => {
  switch (resp.MsgType) {
    case "Heartbeat":
      break;
    case 'Ticker':
      if (resp.Symbol === 'XBTCNY') {
        if (!ticker || ticker.Last !== resp.Last) {
          ticker = resp;
          console.log('ticker', ticker);
        }
      } else if (resp.Symbol === 'BPICNY') {
        if (!BPI || BPI !== resp.Last) {
          console.log(resp.Last, BPI);
          BPI = resp.Last;
          console.log('BPI', BPI);
        }
      } else if (resp.Symbol === 'PremiumAdjustment') {
        if (!PBM || PBM !== resp.PBM) {
          PBM = resp.PBM;
          console.log('PBM', PBM);
        }
      }
      break;
    case 'GetOrdersResponse':
      if (!_.isEmpty(resp.Reports) && resp.Reports.length > 0) {
        _.forEach(resp.Reports, (report) => {
          ExecReport(_ExecReportObj, report);
        });
        console.log('ExecReport', _ExecReportObj);
      }
      if (_orderResp === null) {
        _orderResp = resp.Reports;
        _orderResp.map((val) => {
          Feedback.receiveInitExecReportData(_FeedbackObj, val);
        });
      }
      break;
    case 'GetTradesResponse':
      if (resp.Trades === null) return;
      lastPrice = resp.Trades[0].Price;
      console.log(resp.Trades[0].Side, resp.Trades[0].Price);
      break;
    case 'ExecTrade':
      lastPrice = resp.Trades[0].Price;
      console.log(resp.Trades[0].Side, resp.Trades[0].Price);
      break;
    case 'QuoteResponse':
      if (resp.OrderBook !== null) {
        Sort.sortWebSocketOrderBook(_OrderBook, resp.OrderBook);
        Sort.processOrderBook(_OrderBook, _depth, _orderBookItemLength, (asks, bids) => console.log(asks, bids));
        if (resp.PremiumAdjustment !== null) {
          LCCR = resp.PremiumAdjustment.LCCR;
          SCCR = resp.PremiumAdjustment.SCCR;
        }
      }
      break;
    case 'OrderBook':
      Sort.sortWebSocketOrderBook(_OrderBook, resp);
      Sort.processOrderBook(_OrderBook, _depth, _orderBookItemLength, (asks, bids) => console.log(asks, bids));
      break;
    default:
      break;
  }

  return { type: '' };
}