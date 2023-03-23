import React, { useState } from "react";
import { Animated, FlatList, Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { StyleSheet } from "react-native";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { useAuth } from "../hooks/useAuth";
import DailySettings from "../components/DailySettings";

export default function Dailies(){
    const [showSettings, setShowSettings] = useState(false);
    const [dailies, setDailies] = useState([]);
    const [selectedDaily, setSelectedDaily] = useState(null);
    const [dummy, setDummy] = useState(false);
    const [user, setUser] = useState();
    const auth = useAuth();
    if(user === undefined){
      const string = JSON.stringify(auth.user)
      if(string){
        let parsed = JSON.parse(string);
        setUser(parsed);
      }
    }

    const handleOpenSettings = () => {
      setShowSettings(true);
    };

    const handleCloseSettings = () => {
      setShowSettings(false);
    };

    async function handleSaveDaily(dailySetting){
      if(dailySetting === null)
        return;
      let howOftenInSecs = getT(dailySetting) * 1000;
      const time = new Date();
      const newTime = new Date(time.getTime() - howOftenInSecs).toISOString();
      let newId = 0;
      if(dailies.length == 0){
        newId = 1;
      }else{
        newId = dailies[dailies.length - 1].id + 1;
      }

      const newDaily = {
        id: newId,
        title: dailySetting.title,
        notes: dailySetting.notes,
        completed: newTime,
        timeUnit: dailySetting.timeUnit,
        timeValue: dailySetting.timeValue
      };
      setDailies([...dailies, newDaily]);
      
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const prevUser = docSnap.data();
        const a = await setDoc(doc(db, "users", user.uid),{
          ...prevUser,
          dailies: [...dailies, newDaily]
        });
      }
      
      handleCloseSettings();
    };

    const handleEditDaily = (daily) => {
      setSelectedDaily(daily);
    }

    async function handleSaveEditedDaily(editedDaily){
      if(editedDaily === null){
        const updatedDailies = dailies.filter(function(item){
          return item !== selectedDaily;
        });
        setDailies(updatedDailies);
        setSelectedDaily(null);

        const ref = doc(db, "users", user.uid);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          const prevUser = docSnap.data();
          const a = await setDoc(doc(db, "users", user.uid),{
            ...prevUser,
            dailies: updatedDailies
          });
        }
      }else{
        const updatedDailies = dailies.map((daily) => (daily.id === editedDaily.id ? editedDaily : daily));
        setDailies(updatedDailies);
        setSelectedDaily(null);

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
    }

    async function completeDaily(item){
      const time = new Date().toISOString();
      const updatedDailies = dailies.map((daily) => (daily.id === item.id ? {...daily, completed: time} : daily));
      setDailies(updatedDailies);

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
          howOftenInSecs = 59;
          break;
        case "Hours":
          howOftenInSecs = 3599;
          break;
        case "Days":
          howOftenInSecs = 86399;
          break;
        case "Weeks":
          howOftenInSecs = 604799;
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
      
      if (timeDiffInSecs >= howOftenInSecs) {
        return (
          <View style={styles.DailyStyle}>
            <TouchableWithoutFeedback onPress={() => handleEditDaily(item)}>
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
            <TouchableWithoutFeedback onPress={() => handleEditDaily(item)}>
              <Animated.View style={styles.LeftSideComplete}>
                <Text style={styles.Text}>{item.title}</Text>
                <Text style={styles.Notes}>{item.notes}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <Animated.View style={styles.RightSideComplete}>
                <View style={styles.CompleteCompleteStyle}></View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        )
      }
    };

    React.useEffect(() => {
      const intervalId = setInterval(() => {
        setDummy(!dummy);
      }, 60000);
  
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
          <TouchableWithoutFeedback onPress={handleOpenSettings}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Add Daily</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
  
        <Modal visible={showSettings} animationType="slide">
          <DailySettings onSave={handleSaveDaily} />
          <TouchableWithoutFeedback onPress={handleCloseSettings}>
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
    height: '100%'
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
    paddingLeft: 15,
    paddingVertical: 10,
    width: '70%',
    height: '100%'
  },
  RightSideComplete: {
    backgroundColor: '#adb4d8',
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  CompleteCompleteStyle:{
    backgroundColor: '#adb4d8',
    width: 40,
    height: 40,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
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
});