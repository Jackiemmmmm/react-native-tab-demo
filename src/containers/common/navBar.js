import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';

const navBar = ({title, onRight, initial}) => {
  return (
    <View style={styles.warpper}>
      <Text style={styles.text}>{title}</Text>
      <TouchableOpacity style={[styles.button, styles.leftButton, initial && styles.clear]} onPress={() => Actions.pop()}>
        <Text style={styles.text}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.rightButton, !onRight && styles.clear]} onPress={onRight}>
        <Text style={styles.text}>Go</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  warpper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    paddingTop: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
  button: {
    width: 50,
    height: 44,
    top: 20,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    left: 0
  },
  rightButton: {
    right: 0
  },
  clear: {
    width: 0,
    height: 0,
    opacity: 0,
  }
});

export default navBar;
