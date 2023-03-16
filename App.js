import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Animated, TouchableWithoutFeedback, Easing, Image } from 'react-native';
import React, { useState } from 'react'
import RootNavigation from './navigation/rootNavigation';

export default function App() {

  return (
    <View style={styles.container}>
      <RootNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
