import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Animated, TouchableWithoutFeedback, Easing, Image } from 'react-native';
import React, { useState } from 'react'
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from './config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

export default function SignUp() {
  const [email, setEmail] = useState('user02@gmail.com');
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('');
  const [scaleValue] = useState( new Animated.Value(1) );
  const [fadeValue] = useState( new Animated.Value(1) );
  
  const animateButton = () => {
    Animated.timing(scaleValue, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
  }).start(() => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      }).start();
    })
  };

  const animateButton2 = () => {
    Animated.sequence([
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();
  };

  async function signIn(){
    animateButton2();
    if (email === "" || password === "") {
      setError("Email and password are mandatory.");
      return;
    }
    try{
      await signInWithEmailAndPassword(auth, email, password);
      
    }catch(error){
      setError(error.message);
      console.log(error.message);
    }
  }

  async function signUp() {
    animateButton();
    if (email === '' || password === '') {
      setError('Email and password are mandatory.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(function(user){
          setDoc(doc(db, "users", user.user.uid),{
            email: email,
            dailies: []
          })
        });
    } catch(error){
      setError(error.message);
      console.log(error.message);
    }
  }


   return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Remember</Text>
        <Image style={styles.logo} source={require('../assets/remember-logo.png')} />
      </View>
      <TextInput value={email} onChangeText={(email) => {setEmail(email)}} placeholder="Email" style={styles.textBoxes}></TextInput>
      <TextInput secureTextEntry={true} value={password} onChangeText={(password) => {setPassword(password)}} placeholder="Password" style={styles.textBoxes}></TextInput>
      {error ? <Text>{error}</Text> : ''}

      <View style={styles.buttons}>
      
        <TouchableWithoutFeedback onPress={signUp}>
          <Animated.View style={[styles.button, { transform : [{ scale: scaleValue }]}]}>
            <Text style={styles.buttonText}>Sign up</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={signIn}>
          <Animated.View style={[styles.button, { opacity: fadeValue }]}>
           <Text style={styles.buttonText}>Sign in</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

      </View>
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
  top: {
    flexDirection: 'row',
    marginBottom: 30,
    marginTop: 10,
    marginRight: -20
  },
  textBoxes: {
    maxWidth: 350,
    minWidth: 350,
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
