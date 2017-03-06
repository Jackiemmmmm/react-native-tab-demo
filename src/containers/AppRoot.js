import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { getWs } from '../actions/socketActions';
import wsRequest from '../utils/wsRequest';
import { Scene, Router } from 'react-native-router-flux';
import Page1 from './Page1/';
import Page2 from './Page2/';
import Page2_1 from './Page2_1/';
import Page3 from './Page3/';

const TabbarIcon = ({selected, title}) => {
  return (
    <Text style={{ color: selected ? 'red' : 'black' }}>{title}</Text>
  )
}

class Root extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    let ProWs = new WebSocket('wss://pro-ws-staging.btcc.com:2012/');
    let SpotWs = new WebSocket('wss://pro-ws-staging.btcc.com:2022/');
    this.linkWebSocket('Pro', ProWs);
    this.linkWebSocket('Spot', SpotWs);
  }
  render() {
    return (
      <Router hideNavBar={true}>
        <Scene key="root">
          <Scene initial={true} key="page1" component={Page1} title="Page1" />
          <Scene key="tab" tabs={true} tabBarStyle={{ borderTopWidth: 1, borderTopColor: 'black' }}>
            <Scene key="tab1" title="Tab1" icon={TabbarIcon}>
              <Scene key="page2" component={Page2} title="Page2" />
              <Scene key="page2_1" component={Page2_1} title="Page2_1" direction="vertical" hideTabBar={true} />
            </Scene>
            <Scene key="tab2" title="Tab2" icon={TabbarIcon}>
              <Scene key="page3" component={Page3} title="Page3" initial={true} />
            </Scene>
          </Scene>
        </Scene>
      </Router>
    )
  }
  linkWebSocket(type, ws) {
    ws.onopen = () => {
      console.log('ws open');
      if (type === 'Pro') {
        ws.send(wsRequest.createQuoteRequest('XBTCNY', 2));
        ws.send(wsRequest.createQuoteRequest('BPICNY', 2));
        ws.send(wsRequest.createGetTradesRequest('XBTCNY', 20));
      } else if (type === 'Spot') {
        ws.send(wsRequest.createQuoteRequest('BTCUSD', 2));
        ws.send(wsRequest.createQuoteRequest('BPIUSD', 2));
        ws.send(wsRequest.createGetTradesRequest('BTCUSD', 20));
      }
    };
    ws.onmessage = (e) => {
      const {getWs} = this.props;
      let resp = JSON.parse(e.data);
      if (resp.MsgType !== 'Heartbeat') {
        getWs(type, resp);
      }
    };
    ws.onerror = (e) => {
      console.log('error', e);
    };
    ws.onclose = (e) => {
      console.log('close', e);
    };
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getWs: (type, resp) => dispatch(getWs(type, resp))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Root);