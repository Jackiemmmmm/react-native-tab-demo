import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import NavBar from '../common/navBar';
import { Actions } from 'react-native-router-flux';

const Page2 = ({initial}) => {
  return (
    <View style={styles.wrapper}>
      <NavBar title="Page2" onRight={() => Actions.page2_1()} initial={initial} />
      <Text>Page2</Text>
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

export default Page2;