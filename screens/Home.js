import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native-web";

export default function Home() {
  const text = "Hello"
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBoxes: {
    maxWidth: '90%',
    minWidth: '90%',
    fontSize: 18,
    padding: 12,
    borderColor: '#4D5B9E',
    borderWidth: 0.2,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    //flex: 1,
    backgroundColor: '#4D5B9E',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    elevation: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    padding: 10,
  },
  title: {
    color: '#293264',
    fontSize: 50,
    letterSpacing: 2,
    marginBottom: 40,
    marginTop: 10,
    fontWeight: 800,
  },
  logo: {
    width: 80 ,
    height: 80,
  },
  buttons: {
    flexDirection: 'row'
  }
});
