import wsSignature from './wsSignature';
// import accountInfo from '../utils/accountInfo';
let moment = require('moment');

const createRequest = (type) => {
    return {
        MsgType: type,
        CRID: wsSignature.getUniqueID()
    };
};

// const createSignedRequest = (type) => {
//   let BTCC_PRO_CNY_PRE_ACCOUNT = accountInfo.getAccountInfo('BTCC_PRO_CNY_PRE_ACCOUNT');
//   // console.log(BTCC_PRO_CNY_PRE_ACCOUNT);
//   let request = createRequest(type);
//   let date = new Date();
//   request.Date = moment(date).format('YYYYMMDD'); // 20160520
//   request.Account = BTCC_PRO_CNY_PRE_ACCOUNT.id;
//   return request;
// };

// const signedRequest = (request, fields) => {
//   let headers = [request.MsgType, request.CRID, request.Date, request.Account];
//   let concatArray = [];
//   if (fields) concatArray = headers.concat(fields);
//   else concatArray = headers;
//   let joinStr = concatArray.join('');
//   request.SIG = wsSignature.getSignature(joinStr);
//   return request;
// };

const createGetTradesRequest = (symbol, count) => {
    let request = createRequest('GetTradesRequest');
    request.Count = count;
    request.Symbol = symbol;
    return JSON.stringify(request);
};

const createQuoteRequest = (symbol, type) => {
    let request = createRequest('QuoteRequest');
    request.Symbol = symbol;
    request.QuoteType = type;
    return JSON.stringify(request);
};

// const createGetOrdersRequest = (begin, end, status) => {
//   let request = createSignedRequest('GetOrdersRequest');
//   request.Status = status;
//   request.Begin = begin;
//   request.End = end;
//   signedRequest(request, [begin, end, status]);
//   return JSON.stringify(request);
// };

// const createLoginRequest = () => {
//   let request = createSignedRequest('LoginRequest');
//   signedRequest(request);
//   return JSON.stringify(request);
// };

// const createGetAccountInfoRequest = () => {
//   let request = createSignedRequest('GetAccountInfoRequest');
//   signedRequest(request);
//   return JSON.stringify(request);
// };

// const createPlaceOrderRequest = (symbol, side, orderType, quantity, price, stopPrice, TIF, exprDate, exprTime) => {
//   let request = createSignedRequest('PlaceOrderRequest');
//   request.Symbol = symbol;
//   request.Side = side;
//   request.OrderType = orderType;
//   request.Quantity = quantity;
//   request.Price = price;
//   request.StopPrice = stopPrice;
//   request.TIF = TIF;
//   request.ExprDate = exprDate;
//   request.ExprTime = exprTime;
//   signedRequest(request, [symbol, side, orderType, quantity, price, stopPrice, TIF, exprDate, exprTime]);
//   return JSON.stringify(request);
// };

// const createCancelOrderRequest = (OID, symbol) => {
//   let request = createSignedRequest('CancelOrderRequest');
//   request.Symbol = symbol;
//   request.OID = OID;
//   signedRequest(request, [symbol, OID]);
//   return JSON.stringify(request);
// };

// const createCancelReplaceOrderRequest = (Symbol, OID, Quantity, Price, StopPrice, OldQuantity) => {
//   let request = createSignedRequest('CancelReplaceOrderRequest');
//   request.Symbol = Symbol;
//   request.OID = OID;
//   request.Quantity = Quantity;
//   request.OldQuantity = OldQuantity;
//   request.Price = Price;
//   request.StopPrice = StopPrice;
//   signedRequest(request, [Symbol, OID, Quantity, Price, StopPrice, OldQuantity]);
//   return JSON.stringify(request);
// };

// const createLogoutRequest = () => {
//   let request = createSignedRequest('LogoutRequest');
//   signedRequest(request);
//   return JSON.stringify(request);
// };

export default {
    // createLogoutRequest,
    createGetTradesRequest,
    createQuoteRequest,
    // createGetOrdersRequest,
    // createLoginRequest,
    // createGetAccountInfoRequest,
    // createPlaceOrderRequest,
    // createCancelOrderRequest,
    // createCancelReplaceOrderRequest,
}
