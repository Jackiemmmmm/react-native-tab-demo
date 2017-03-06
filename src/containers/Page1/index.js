import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  WebView,
  Platform
} from 'react-native';
import NavBar from '../common/navBar';
import { Actions } from 'react-native-router-flux';

const Page1 = ({initial}) => {
  console.log('test')
  return (
    <View style={styles.wrapper}>
      <NavBar title="Page1" onRight={() => Actions.tab()} initial={initial} />
      <View style={{width: 375,height: 600, backgroundColor: 'green'}}>
        <WebView
          source={{uri: Platform.OS === 'ios' ? 'http://localhost:9492/' : 'http://10.0.20.220:9492/'}}
         />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
  }
})

export default Page1;