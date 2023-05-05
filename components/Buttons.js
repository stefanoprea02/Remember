import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Buttons = ({ message, handlePress, size}) => {
    return <TouchableOpacity onPress={handlePress}>
        <View style={styles.container}>
          <Text style={{fontWeight: '600', color: 'white', fontSize: size}}>{message}</Text>
        </View>
      </TouchableOpacity>
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    minWidth: 250,
    minHeight: 50,
    backgroundColor: '#5B5A62',//'#6255B4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  }
});

export default Buttons;