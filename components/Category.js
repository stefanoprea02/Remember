import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Modal, Text } from 'react-native';

export default function Category({ onSave }){
    return (
    <Modal visible={true} animationType='slide'>  
        <View style={styles.subContainers}>
          <Text style={styles.title}>Family</Text>
          <TouchableOpacity onPress={() => onSave('family')}>
              <Image style={styles.img} source={require('../assets/family.jpeg')} />
          </TouchableOpacity>
        </View>
        <View style={styles.subContainers}>
          <Text style={styles.title2}>Hobbies</Text>
          <TouchableOpacity onPress={() => onSave('hobbies')}>
              <Image style={styles.img} source={require('../assets/hobbies.jpeg')} />
          </TouchableOpacity>
        </View>
        <View style={styles.subContainers}>
          <Text style={styles.title}>Special Events</Text>
          <TouchableOpacity onPress={() => onSave('events')}>
              <Image style={styles.img} source={require('../assets/events.jpeg')} />
          </TouchableOpacity>
        </View>
    </Modal>
    );
  }

const styles = StyleSheet.create({
    img: {
      width: '95%',
      height: 250,
      resizeMode: 'contain',
    },
    subContainers: {
      height: '33%',
    },
    title: {
      color: '#5B5A62',//'#293264',
      fontSize: 28,
      letterSpacing: 2,
      fontWeight: '800',
      marginHorizontal: 20,
      marginVertical: 0,
    },
    title2: {
      color: '#5B5A62',//'#293264',
      fontSize: 28,
      letterSpacing: 2,
      fontWeight: '800',
      alignSelf: 'flex-end',
      marginHorizontal: 20,
    },
});