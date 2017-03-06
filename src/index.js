import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import AppRoot from './containers/AppRoot';

const store = createStore(reducer, {}, compose(
  applyMiddleware(thunk)
));

const App = () => {
  return (
    <Provider store={store}>
      <AppRoot />
    </Provider>
  )
}

export default App;