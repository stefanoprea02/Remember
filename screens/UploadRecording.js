import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { StyleSheet, Text, View, Button, Image, ActivityIndicator, TextInput, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { app, firebase, db } from './config';
import { useAuth } from '../hooks/useAuth';
import { storage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function UploadRecording() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [uploading, setUploading] = useState(false);
  const [recordUrl, setRecordUrl] = useState(null);
  const [user, setUser] = useState();
  const auth = useAuth();
  if(user === undefined){
    const string = JSON.stringify(auth.user)
    if(string){
      let parsed = JSON.parse(string);
      setUser(parsed);
    }
  }
  let info;

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    info = recording.getURI();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });
    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.recordingText}>Recording {index + 1} - {recordingLine.duration}</Text>
          <TouchableWithoutFeedback onPress={() => recordingLine.sound.replayAsync()}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Play</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
  }
  const saveSoundAndUpdateDoc = async (writing, recordings) => {
    const path = `Records/${user.uid}/file1`;
    const blob = await new Promise((resolve, reject) => {
      const fetchXHR = new XMLHttpRequest();
      fetchXHR.onload = function () {
        resolve(fetchXHR.response);
      };
      fetchXHR.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      fetchXHR.responseType = 'blob';
      fetchXHR.open('GET', recordings, true);
      fetchXHR.send(null);
    }).catch((err) => console.log(err));
  
    const recordRef = firebase.storage().ref(path);
  
    await uploadBytes(recordRef, blob)
      .then(async (snapshot) => {
        const downloadURL = await getDownloadURL(recordRef).then((recordUrl2) => {
          setRecordUrl(recordUrl2);
            /*
          const addDocRef = collection(db, 'users', user.uid);
          addDoc(addDocRef, {
            creator: user.uid,
            recordURL,
            creation: serverTimestamp(),
          })
            .then(() => {})
            .then(() => resolve())
            .catch((err) => console.log(err));*/
        });
        blob.close();
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    async function fetchData(){
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        let recordings = docSnap.data().recordings;
        recordings = [...recordings, recordUrl];
        const prevUser = docSnap.data();
        const a = await setDoc(doc(db, "users", user.uid),{
          ...prevUser,
          recordings: recordings
        });
      } 
    }
    if(recordUrl && recordUrl[0]==='h')
      fetchData();
  }, [recordUrl]);  

  return (
    <View style={styles.container}>
      {message && <Text>{message}</Text>}
      <TouchableWithoutFeedback onPress={recording ? stopRecording : startRecording}>
          <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
          </Animated.View>
      </TouchableWithoutFeedback>
      <ScrollView>
        <View>
          {getRecordingLines()}
        </View>
      </ScrollView>
      {!uploading ? 
        <TouchableWithoutFeedback onPress={saveSoundAndUpdateDoc}>
            <Animated.View style={styles.button}>
                <Text style={styles.buttonText}>Save last recording</Text>
            </Animated.View>
        </TouchableWithoutFeedback> : <ActivityIndicator size={'small'} color='black' />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    padding: 7,
  },
  recordingText: {
    color: '#293264',
    fontSize: 20,
    padding: 7,
  },
});