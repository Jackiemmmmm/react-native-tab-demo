import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import NavBar from '../common/navBar';

const Page3 = ({initial}) => {
  return (
    <View style={styles.wrapper}>
      <NavBar title="Page3" initial={initial} />
      <Text>Page3</Text>
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

export default Page3;