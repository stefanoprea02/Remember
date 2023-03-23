import React from 'react';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';

export default function Category({onSave}){
    return (
      <View style={styles.innerContainer}>
        <View>
          <TouchableHighlight onPress={() => onSave('family')}>
              <Image style={styles.img} source={require('../assets/family.jpeg')} />
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight onPress={() => onSave('hobbies')}>
              <Image style={styles.img} source={require('../assets/hobbies.jpeg')} />
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight onPress={() => onSave('events')}>
              <Image style={styles.img} source={require('../assets/events.jpeg')} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
    innerContainer:{
        width: '100%'
    },
    img: {
        width: '95%',
        height: 250,
        resizeMode: 'contain',
    },
});
  