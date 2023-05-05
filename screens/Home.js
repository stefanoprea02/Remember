import { StyleSheet, Text, View, TextInput, Animated, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import { getAuth } from 'firebase/auth';
import { animateButton } from '../components/ButtonAnimations';
import Buttons from '../components/Buttons';

const auth = getAuth();

export default function Home({ navigation }) {
  const [scaleValue] = useState( new Animated.Value(1) );

  async function signOut(){
    animateButton(scaleValue);
    auth.signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <TouchableOpacity>
        <Buttons
          size={20}
          handlePress={ () => {
            navigation.navigate('Games');
          }} 
          message="Go To Games Screen"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={signOut}>
        <Animated.View style={[styles.button, { transform : [{ scale: scaleValue }]}]}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Animated.View>
      </TouchableOpacity>
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
    backgroundColor: '#5B5A62',//'#BFB4A8', //'#4D5B9E',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 30,
    margin: 10,
    cursor: 'pointer',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    padding: 10,
    fontWeight: '600',
  },
  title: {
    color: '#293264',
    fontSize: 50,
    letterSpacing: 2,
    fontWeight: 800,
  },
});
