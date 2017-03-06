// import webSocket from '../socket/webSocket';
// import wsRequest from '../socket/wsRequest';
import { plusCalculate, reduceCalculate, dividedCalculate } from './calculate';
import { sortNumber } from './tradeCalculate';
import I18n from 'react-native-i18n';

const sortOrderBookByDepth = (arr, count, flag, depth) => {
  var orderArr = [];
  var basicAmount = 0;
  if (arr.length > 0) {

    var basicPrice = flag == 'ASK' ? dividedCalculate(Math.ceil(arr[0][0] * 2000), 2000) : dividedCalculate(Math.floor(arr[0][0] * 2000), 2000);
    for (var i = 0; i < arr.length; i++) {
      let reducePrice = flag == 'ASK' ? reduceCalculate(basicPrice, arr[i][0]) : reduceCalculate(arr[i][0], basicPrice);
      if (reducePrice < depth && reducePrice >= 0) {
        basicAmount += arr[i][1];
      }
      else {
        if (basicAmount !== 0) {
          orderArr.push([basicPrice, basicAmount]);
          if (orderArr.length >= count) {
            break;
          }
        }
        while (true) {
          let reducePrice2 = flag == 'ASK' ? reduceCalculate(basicPrice, arr[i][0]) : reduceCalculate(arr[i][0], basicPrice);
          if (reducePrice2 < depth && reducePrice2 >= 0) {
            basicAmount += arr[i][1];
            break;
          }
          else {
            if (flag == 'ASK') basicPrice += depth;
            else basicPrice -= depth;
          }
        }
      }
    }
    if (basicPrice !== 0 && orderArr.length < count) {
      orderArr.push([basicPrice, basicAmount]);
    }
  }
  if (flag == 'ASK') return sortOrderBookWithoutDepth(orderArr, count, flag);
  else return sortOrderBookWithoutDepth(orderArr, count, flag);
}

const sortOrderBookWithoutDepth = (arr, count, flag) => {
  let orderArr = [];
  let totalAmount = 0;
  for (var i = 0; i < count; i++) {
    if (i > arr.length - 1) {
      let askObj = {
        type: (flag === 'ASK' ? I18n.t('label_book_ask') : I18n.t('label_book_bid')) + (i + 1),
        price: '-',
        quantity: '-',
        total: '-',
      }
      orderArr.push(askObj);
    }
    else {
      totalAmount += arr[i][1];
      let askObj = {
        type: (flag === 'ASK' ? I18n.t('label_book_ask') : I18n.t('label_book_bid')) + (i + 1),
        price: arr[i][0].toString(),
        quantity: arr[i][1].toString(),
        total: totalAmount.toString(),
      }
      orderArr.push(askObj);
    }
  }
  if (flag == 'ASK') return orderArr.reverse();
  else return orderArr;
}

const sortWebSocketOrderBook = (that, data) => {
  // console.log(data);
  if (data.Type === "F") {
    that.version = data.Version;
    that.askData = {};
    that.bidData = {};
    //divide the ask or bid orders
    data.List.forEach(function (n, key) {
      if (n.Side === "1") {
        that.bidData[n.Price] = { Price: n.Price, Quantity: n.Size };
      }
      else if (n.Side === "2") {
        that.askData[n.Price] = { Price: n.Price, Quantity: n.Size };
      }
    });
    // console.log( 'F:',that.askData, that.bidData, that.version);
  }
  else if (data.Type === "I") {
    // if version = 32767
    if (data.Version >= 32767) that.version = 0;
    else that.version++;
    // console.log('current version:', that.version);
    // console.log('data version:', data.Version);
    // check if orderbook.version + 1 = version
    // if not do new quote request
    if (that.version !== data.Version) {
      console.log('wrong version!');
      // ws.send(wsRequest.createQuoteRequest('XBTCNY', 2));
      return;
    }
    else {
      //divide the ask or bid orders
      data.List.forEach(function (n, key) {
        if (n.Side == "1") {
          var obj = that.bidData[n.Price];
          if (obj == null) {
            that.bidData[n.Price] = { Price: n.Price, Quantity: n.Size };
          }
          else {
            var qty = obj.Quantity + n.Size;
            if (qty <= 0) {
              delete that.bidData[n.Price];
              if (qty < 0) {
                // webSocket.sendRequest(wsRequest.createQuoteRequest('BTCUSD', 2));
                that.askData = {};
                that.bidData = {};
                return;
              }
            }
            else {
              that.bidData[n.Price].Quantity = qty;
            }
          }
        }
        else if (n.Side === "2") {
          var obj2 = that.askData[n.Price];
          if (obj2 == null) {
            that.askData[n.Price] = { Price: n.Price, Quantity: n.Size };
          }
          else {
            var qty2 = obj2.Quantity + n.Size;
            if (qty2 <= 0) {
              delete that.askData[n.Price];
              if (qty2 < 0) {
                // webSocket.sendRequest(wsRequest.createQuoteRequest('BTCUSD', 2));
                that.askData = {};
                that.bidData = {};
                return;
              }
            }
            else {
              that.askData[n.Price].Quantity = qty2;
            }
          }
        }
      });
      // console.log('I:', that.askData, that.bidData, that.version);
    }
  }
}

const processOrderBook = (orderBook, depth, itemLength, changeOrderList) => {
  let askData = [], bidData = [], ASKS, BIDS;
  for (var i in orderBook.askData) {
    askData.push([parseFloat(orderBook.askData[i].Price), parseFloat(orderBook.askData[i].Quantity)]);
  }
  for (var i in orderBook.bidData) {
    bidData.push([parseFloat(orderBook.bidData[i].Price), parseFloat(orderBook.bidData[i].Quantity)]);
  }
  if (depth !== 'OFF') {
    ASKS = sortOrderBookByDepth(askData.sort(sortNumber), itemLength, 'ASK', parseFloat(depth));
    BIDS = sortOrderBookByDepth(bidData.sort(sortNumber).reverse(), itemLength, 'BID', parseFloat(depth));
  }
  else {
    ASKS = sortOrderBookWithoutDepth(askData.sort(sortNumber), itemLength, 'ASK');
    BIDS = sortOrderBookWithoutDepth(bidData.sort(sortNumber).reverse(), itemLength, 'BID');
  }
  changeOrderList(ASKS, BIDS);
}

export default {
  sortOrderBookByDepth,
  sortOrderBookWithoutDepth,
  sortWebSocketOrderBook,
  processOrderBook
}
