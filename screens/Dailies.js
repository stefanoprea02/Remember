import React, { useState, useContext } from "react";
import { Animated, Dimensions, FlatList, Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { StyleSheet } from "react-native";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { useAuth } from "../hooks/useAuth";
import DailySettings from "../components/DailySettings";
import PushNotificationContext from "../PushNotificationContext";
import { sendPushNotification, schedulePushNotification } from "../PushNotificationContext";

export default function Dailies(){
    const [showSettings, setShowSettings] = useState(false);
    const [dailies, setDailies] = useState([]);
    const [selectedDaily, setSelectedDaily] = useState(null);
    const [dummy, setDummy] = useState(false);
    const expoPushToken = useContext(PushNotificationContext);
    const [user, setUser] = useState();
    const auth = useAuth();
    if(user === undefined){
      const string = JSON.stringify(auth.user)
      if(string){
        let parsed = JSON.parse(string);
        setUser(parsed);
      }
    }

    function scheduleNotfication(item){
      const secs = getT(item);
      schedulePushNotification({
        content: {
          to: expoPushToken,
          title: `You have a new daily to complete!`,
          body: `Daily ${item.title} is ready!`,
          data: { someData: 'goes here' },
        },
        trigger:{
          seconds: secs,
          channelId: 'default'
        },
      });
    }

    async function saveToDB(updatedDailies){
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const prevUser = docSnap.data();
        const a = await setDoc(doc(db, "users", user.uid),{
          ...prevUser,
          dailies: updatedDailies
        });
      }
    }

    async function handleSaveDaily(dailySetting){
      if(dailySetting === null)
        return;
      if(dailySetting.id == ''){
        if(dailies.length == 0){
          dailySetting.id = 1;
        }else{
          dailySetting.id = dailies[dailies.length - 1].id + 1;
        }
      }
      const updatedDailies = [...dailies, dailySetting];
      setDailies(updatedDailies);
      scheduleNotfication(dailySetting);
      saveToDB(updatedDailies);
      setShowSettings(false);
    };

    async function handleSaveEditedDaily(editedDaily){
      if(editedDaily === null){
        const updatedDailies = dailies.filter(function(item){
          return item !== selectedDaily;
        });
        setDailies(updatedDailies);
        setSelectedDaily(null);
        saveToDB(updatedDailies);
      }else{
        const updatedDailies = dailies.map((daily) => (daily.id === editedDaily.id ? editedDaily : daily));
        setDailies(updatedDailies);
        setSelectedDaily(null);
        scheduleNotfication(editedDaily);
        saveToDB(updatedDailies);
      }
    }

    async function completeDaily(item){
      const time = new Date().toISOString();
      const updatedDailies = dailies.map((daily) => (daily.id === item.id ? {...daily, completed: time} : daily));
      setDailies(updatedDailies);
      scheduleNotfication(item);

      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const prevUser = docSnap.data();
        const a = await setDoc(doc(db, "users", user.uid),{
          ...prevUser,
          dailies: updatedDailies
        });
      }
    }

    function getT(item){
      let howOftenInSecs;
    
      switch(item.timeUnit){
        case "Minutes":
          howOftenInSecs = 60;
          break;
        case "Hours":
          howOftenInSecs = 3600;
          break;
        case "Days":
          howOftenInSecs = 86400;
          break;
        case "Weeks":
          howOftenInSecs = 604800;
          break;
      }
      return howOftenInSecs = howOftenInSecs * item.timeValue;
    }

    const renderDailyItem = ({ item }) => {
      const date1 = new Date(item.completed);
      const date2 = new Date();

      const timeDiff = Math.abs(date2.getTime() - date1.getTime());
      const timeDiffInSecs = Math.floor(timeDiff / 1000);

      let howOftenInSecs = getT(item);
      const dif = howOftenInSecs - timeDiffInSecs;

      const days = Math.floor(dif / (3600 * 24));
      const hours = Math.floor((dif % (3600 * 24)) / 3600);
      const minutes = Math.floor((dif % 3600) / 60);
      
      if (timeDiffInSecs >= howOftenInSecs) {
        return (
          <View style={styles.DailyStyle}>
            <TouchableWithoutFeedback onPress={() => setSelectedDaily(item)}>
              <Animated.View style={styles.LeftSide}>
                <Text style={styles.Text}>{item.title}</Text>
                <Text style={styles.Notes}>{item.notes}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => completeDaily(item)}>
              <Animated.View style={styles.RightSide}>
                <View style={styles.CompleteStyle}></View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        )
      } else {
        return (
          <View style={styles.DailyStyle}>
            <TouchableWithoutFeedback onPress={() => setSelectedDaily(item)}>
              <Animated.View style={[styles.LeftSideComplete, {width: Dimensions.get('window').width * 70/100 + 70}]}>
                <View>
                  <Text style={styles.Text}>{item.title}</Text>
                  <Text style={styles.Notes}>{item.notes}</Text>
                </View>
                <Text style={styles.Time}>{days}D {hours}H {minutes}M left</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        )
      }
    };

    React.useEffect(() => {
      const intervalId = setInterval(() => {
        setDummy(!dummy);
      }, 5000);
  
      return () => clearInterval(intervalId);
    }, [dummy]);

    React.useEffect(() => {
      async function fetchData(){
        const ref = doc(db, "users", user.uid);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setDailies(docSnap.data().dailies);
        } 
      }
      if(user)
        fetchData();
    }, [user]);

    return (
      <View style={styles.container}>
        <FlatList
          data={dailies}
          renderItem={renderDailyItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
  
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={() => setShowSettings(true)}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Add Daily</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
  
        <Modal visible={showSettings} animationType="slide">
          <DailySettings onSave={handleSaveDaily} />
          <TouchableWithoutFeedback onPress={() => setShowSettings(false)}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>

        {selectedDaily && (
          <Modal visible={true} animationType="slide">
            <DailySettings daily={selectedDaily} onSave={handleSaveEditedDaily} />
            <TouchableWithoutFeedback onPress={() => setSelectedDaily(null)}>
              <Animated.View style={styles.button}>
                <Text style={styles.buttonText}>Close</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  list: {
    flex: 1,
  },
  button: {
    //flex: 1,
    backgroundColor: '#4D5B9E',
    borderRadius: 5,
    margin: 10,
    elevation: 5,
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2
  },
  DailyStyle:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    marginVertical: 10,
  },
  LeftSide: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    cursor: 'pointer',
    paddingLeft: 15,
    paddingVertical: 10,
    width: '70%',
    height: '100%',
    overflow: 'hidden'
  },
  RightSide: {
    backgroundColor: '#4D5B9E',
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  CompleteStyle:{
    backgroundColor: '#7587e0',
    width: 40,
    height: 40,
    borderRadius: 10
  },
  LeftSideComplete: {
    backgroundColor: '#adb4d8',
    cursor: 'pointer',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    padding: 7,
  },
  Text: {
    color: '#4D5B9E',
    fontSize: 20,
    padding: 0,
  },
  Notes: {
    color: '#4D5B9E',
    fontSize: 14,
    padding: 0,
  },
  Time: {
    color: '#4D5B9E',
    fontSize: 16,
    padding: 0,
  }
});