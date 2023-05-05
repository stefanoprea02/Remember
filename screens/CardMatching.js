import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

import Card from '../components/Card';
import Buttons from '../components/Buttons';
import Svg, { Circle } from 'react-native-svg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CongratsBanner from '../components/CongratsBanner';

const cardsData = [
  { id: 1, value: 'A', matched: false, path: require('../assets/sword2.jpg') },
  { id: 2, value: 'A', matched: false, path: require('../assets/sword2.jpg') },
  { id: 3, value: 'B', matched: false, path: require('../assets/potion2.jpg') },
  { id: 4, value: 'B', matched: false, path: require('../assets/potion2.jpg') },
  { id: 5, value: 'C', matched: false, path: require('../assets/shield2.jpg') },
  { id: 6, value: 'C', matched: false, path: require('../assets/shield2.jpg') },
  { id: 7, value: 'E', matched: false, path: require('../assets/papirus2.jpg') },
  { id: 8, value: 'E', matched: false, path: require('../assets/papirus2.jpg') },
  { id: 9, value: 'F', matched: false, path: require('../assets/ring2.jpg') },
  { id: 10, value: 'F', matched: false, path: require('../assets/ring2.jpg') },
  { id: 11, value: 'G', matched: false, path: require('../assets/helmet2.jpg') },
  { id: 12, value: 'G', matched: false, path: require('../assets/helmet2.jpg') },
];

const CardMatching = ({ navigation }) => {
  const [sound, setSound] = useState();

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/Match.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [circumference, setCircumference] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (secondsLeft > 0) {
        setSecondsLeft(secondsLeft - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
    }, [secondsLeft]);

    
    useEffect(() => {
      const circleCircumference = 2 * Math.PI * 30;
      setCircumference(circleCircumference);
  }, []);

  const strokeDashoffset = circumference * (1 - (secondsLeft / 60));

  const shuffleCards = (cardsArray) => {
      let currentIndex = cardsArray.length,
        temporaryValue,
        randomIndex;
    
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
  
        temporaryValue = cardsArray[currentIndex];
        cardsArray[currentIndex] = cardsArray[randomIndex];
        cardsArray[randomIndex] = temporaryValue;
      }
    
      return cardsArray;
    };
  
  const [cards, setCards] = useState(shuffleCards([...cardsData]));
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [doublePoints, setDoublePoints] = useState(0);

  const handlePress = (card) => {
    if(choiceOne && choiceOne !== card && card.matched === false)
    {
      setChoiceTwo(card);
    }
    else if(card.matched === false)
      setChoiceOne(card);
  };

  useEffect(() => {
    if(choiceOne && choiceTwo) {
      setDisabled(true);
      if(choiceOne.value === choiceTwo.value) {
        if(secondsLeft >= 30)
          setDoublePoints(doublePoints + 1);
        if(score < 5)
          playSound();
        setScore(score + 1);
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if(card.value === choiceOne.value)
              return ({...card, matched: true})
            else
              return card;
          })
        })
        resetTurn();
      }
      else {
        setTimeout(() => resetTurn(), 500)
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null);
    setTimeout(() => setDisabled(false), 50);
  };

  const restartGame = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
    setCards(shuffleCards([...cardsData]));
    setSecondsLeft(60);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={{marginHorizontal: 10, marginVertical: 0, flexDirection: 'row'}} 
        onPress={() => { navigation.navigate('Home') }}
      >
        <FeatherIcon name='log-out' size={30}/>    
      </TouchableOpacity>
      <View>
        {(secondsLeft === 0 && score !== 6) ? 
          <Modal animationType="slide" transparent={true}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>You've lost! 😢</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 }}>Score : {score} out of 6</Text>
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
            :
          <View style={{alignItems: 'center', flexDirection: 'row', margin: 0}}>
            <Text style={{fontSize: 30, color: '#4D5B9E', fontWeight: '600', marginRight: 'auto', marginLeft: 20}}>
              Score : {score}
            </Text>
          <View style={{alignSelf: 'flex-end', marginHorizontal: 20}}>
            <Svg style={{ height: "100", width: "200"}}>
              <View style={{ height: 68, width: 68, position: 'relative', left: 130, top: 16, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{ position: 'absolute', color: "#4D5B9E", fontSize: 25, fontWeight: 'bold'}}>
                  {secondsLeft}
                </Text>
              </View>
              <Circle
                cx="82%" 
                cy="50%"
                r="30"
                stroke="#4D5B9E"
                strokeWidth="8"
                fill="transparent"
                opacity={0.3}
              />
              <Circle
                cx="82%"
                cy="50%"
                r="30"
                stroke="#4D5B9E"
                strokeWidth="8"
                strokeDasharray={`${circumference}, ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill='transparent'
              />
            </Svg>
          </View>
          </View>
        }
        {(score === 6) && 
        <CongratsBanner restartGame={restartGame} navigation={navigation}/>
        }
      </View>
      <View style={styles.gameContainer}>
        {cards.map((card) => (
          <Card 
            key={card.id}
            card={card}
            faceUp={card === choiceOne || card === choiceTwo || card.matched}
            handlePress={handlePress}
            disabled={disabled}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
          <Buttons
            size={20}
            message='Restart Game'
            handlePress={restartGame}
          />
      </View>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 0,
    margin: 0,
  },
  buttonContainer: {
    display: 'flex',
    width: '70%',
    marginHorizontal: 50,
    marginVertical: 25,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  score: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 80,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDD',
    borderRadius: 10,
  },
  popUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: 'center',
  },
});

export default CardMatching;