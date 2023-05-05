import React, { useState, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Card = ({ card, faceUp, handlePress, disabled }) => {
    const cardRef = useRef(null);
    const action = () => {
        if(!disabled)
        {
            handlePress(card);
            if(cardRef.current)
                cardRef.current.flipInY(500);
        }
    }

    return (
        <View style={{margin: 8, borderRadius: 8, overflow: 'hidden'}}>
          <Animatable.View
            ref={cardRef}
          >
            <TouchableOpacity onPress={action}>
              {faceUp ? 
              <View> 
                {(card.matched === false) ? 
                  <View style={styles.cardFaceUp}>
                    <Image style={{resizeMode: 'cover', height: 110, width: 110}} source={card.path}/>
                  </View> : 
                  <View style={styles.cardFaceUp}>
                    <Image 
                      style={{resizeMode: 'cover', height: 110, width: 110, borderColor: '#66FF99', borderWidth: 3, borderRadius: 8}} 
                      source={card.path}
                    />
                  </View>
                }
              </View> : 
              <View style={styles.cardFaceDown}>
                  <Image  style={{height: 60, width: 100}} source={require('../assets/brain2.png')}/>
              </View>
              }
            </TouchableOpacity>
          </Animatable.View>
        </View>
     );
};

const styles = StyleSheet.create({
  cardFaceUp: {
    backgroundColor: 'white',
    height: 110,
    width: 110,
  },
  cardText: {
    color: 'black'
  },
  cardFaceDown: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4D5B9E',
    width: 110,
    height: 110,
  }
});

export default Card;