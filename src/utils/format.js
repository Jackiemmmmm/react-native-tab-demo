/**
 * Created by joy on 11/8/16.
 */
class Format {
  _formatPrice (number, precision) {
    let tempVar = undefined;
    let result = undefined;
    let tempPrecision = precision || 2;
    if (number == undefined || number == null || isNaN(number)) {
      return '--';
    }
    if (typeof number == 'string') {
      tempVar = parseFloat(number);
    } else {
      tempVar = number;
    }
    result = tempVar.toFixed(tempPrecision).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    return result;
  }

  stringifyVolumn (number) {
    let tempVar = undefined;
    let result = '';
    if (number == undefined || number == null || isNaN(number)) {
      return '-';
    }
    if (typeof number == 'string') {
      tempVar = parseFloat(number);
    } else {
      tempVar = number;
    }
    let resultTemp = Math.round(tempVar).toString();
    let num = Math.trunc(resultTemp.length / 3);
    result += resultTemp.substr(0, resultTemp.length - num * 3);
    for (let i = 0; i < num; i++) {
      let temp = (result == '' ? '' : ',');
      result += temp + resultTemp.substr(resultTemp.length - (num - i) * 3, 3);
    }
    return result;
  }

  stringifyPrice (type, number, extra = undefined) {
    switch (type) {
      case 'price':
        return this._formatPrice(number);
      case 'percent':
        return extra.isPlus ? ('+' + (number * 100).toFixed(2) + '%') : (number * 100).toFixed(2) + '%';
      case 'number':
        return extra.isPlus ? ('+' + number.toFixed(2)) : number.toFixed(2);
      case 'money':
        return extra.sign + this._formatPrice(number);
      default:
        return this._formatPrice(number);
    }
  }

  stringifyTime (timestamp, type) {
    let date = new Date(timestamp);
    let Y = date.getFullYear();
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
    let h = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();
    let m = date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes();
    let s = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds();
    switch (type) {
      case 'YMDhms':
        return Y + '.' + M + '.' + D + ' ' + h + ':' + m + ':' + s;
      default:
        return h + ':' + m + ':' + s;
    }
  }
}
export default new Format();
