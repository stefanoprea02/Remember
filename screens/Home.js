import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { StyleSheet } from "react-native-web";
import { getAuth, signOut } from "@firebase/auth";
import { Animated } from "react-native";

const auth = getAuth();

export default function Home() {
  async function signOut(){
    auth.signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <TouchableWithoutFeedback onPress={signOut}>
        <Animated.View style={styles.button}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
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
  button: {
    //flex: 1,
    backgroundColor: '#4D5B9E',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    elevation: 5,
    cursor: 'pointer'
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
});
