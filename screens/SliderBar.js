import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react'
import Slider from '@react-native-community/slider'

export default function SliderBar() {
  const [range, setRange] = useState('50%');
  const [sliding, setSliding] = useState('Seteaza starea');

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{range}</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{sliding}</Text>

      <Slider 
        style={{ width: 250, height: 40, opacity: 0.8}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor='#483D8B'
        maximumTrackTintColor='#6495ED'
        thumbTintColor='#293264'
        value={.5}
        onValueChange={value => setRange(parseInt(value * 100) + '%')}
        onSlidingStart={ () => setSliding('Se alege') }
        onSlidingComplete={ () => setSliding('Seteaza starea') }
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
