import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Modal } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Buttons from '../components/Buttons';
import { Audio } from 'expo-av';

export default function CongratsBanner ({ restartGame, navigation }) {
  const [sound, setSound] = useState();

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/Victory.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    playSound();
  }, []);

  return (
    <Modal animationType="slide" transparent={true}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>You've won! 😊</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 }}>Score : 6 </Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity 
                  style={{marginHorizontal: 15, marginVertical: 10, flexDirection: 'row'}} 
                  onPress={() => { navigation.navigate('Home') }}
                >
                  <FeatherIcon name='log-out' size={30}/>    
                </TouchableOpacity>
                <Buttons
                  size={20}
                  message='Restart Game'
                  handlePress={restartGame}
                />
              </View>
            </View>
          </View>
        </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB6C1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  title: {
    fontSize: 35,
    padding: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 16,
    color: 'white',
  },
});