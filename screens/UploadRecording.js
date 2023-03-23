import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { firebase, db } from './config';
import { useAuth } from '../hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from '@firebase/storage';

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

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
  
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const recordingObject = new Audio.Recording();
        await recordingObject.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recordingObject.startAsync();
  
        setRecording(recordingObject);
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
  
    const blob = await new Promise((resolve, reject) => {
      const fetchXHR = new XMLHttpRequest();
      fetchXHR.onload = function () {
        resolve(fetchXHR.response);
      };
      fetchXHR.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      fetchXHR.responseType = 'blob';
      fetchXHR.open('GET', recording.getURI(), true);
      fetchXHR.send(null);
    }).catch((err) => console.log(err));
  
    const uriParts = recording.getURI().split(".");
    const fileType = uriParts[uriParts.length - 1];

    const path = `Recordings/${user.uid}/${recordings.length}.${fileType}`;
    const recordRef = firebase.storage().ref(path);
  
    await recordRef.put(blob, {contentType: `audio/${fileType}`})
      .then(async (snapshot) => {
        const downloadURL = await recordRef.getDownloadURL()
          .then((recordUrl2) => {
            setRecordUrl(recordUrl2);
            let rec = recordings;
            setRecordings([...rec, recordUrl2]);
          });
        blob.close();
      })
      .catch((err) => console.log(err));
  }

  async function playAudio(index) {
    const path = `Recordings/${user.uid}/${index}.3gp`;
    const recordRef = firebase.storage().ref(path);
    const uri = await recordRef.getDownloadURL();

    const soundObject = new Audio.Sound();
    try{
      await soundObject.loadAsync(
        { uri },
        { shouldCorrectPitch: true }
      );
      await soundObject.playAsync();
    }catch(error){
      console.log(error);
    }
  }

  /*
  async function deleteAudio(index){
    const storage = getStorage();
    const desertRef = ref(storage, `Recordings/${user.uid}/${index}.3gp`);
    deleteObject(desertRef);

    console.log(recordings);
    const updatedRecordings = recordings.splice(, 1);
    setRecordings(updatedRecordings);
    console.log(updatedRecordings);

    const ref2 = doc(db, "users", user.uid);
    const docSnap = await getDoc(ref2);
    if (docSnap.exists()) {
      const prevUser = docSnap.data();
      const a = await setDoc(doc(db, "users", user.uid),{
        ...prevUser,
        recordings: updatedRecordings
      });
    }
  }

            <TouchableWithoutFeedback onPress={() => deleteAudio(index)}>
            <Animated.View style={styles.DeleteStyles}>
              <Text style={styles.buttonText}>Delete</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
  */

  let records = [];
  if(recordings){
    records = recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.recordingText}>Recording {index + 1}</Text>
          <TouchableWithoutFeedback onPress={() => playAudio(index)}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Play</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      );
    })
  }

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
    if(recordUrl && recordUrl[0]==='h' && recordUrl != recordings[recordings.length - 1])
      fetchData();
  }, [recordUrl]);

  React.useEffect(() => {
    async function fetchData(){
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        setRecordings(docSnap.data().recordings);
      } 
    }
    if(user)
      fetchData();
  }, [user])

  return (
    <View style={styles.container}>
      {message && <Text>{message}</Text>}
      <ScrollView style={styles.records}>
        <View>
          {records}
        </View>
      </ScrollView>
      <TouchableWithoutFeedback onPress={recording ? stopRecording : startRecording}>
          <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
          </Animated.View>
      </TouchableWithoutFeedback>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  records: {
    flex: 1
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
    fontSize: 18,
    padding: 7,
  },
  recordingText: {
    color: '#293264',
    fontSize: 20,
    padding: 7,
  },
  DeleteStyles: {
    backgroundColor: '#e34234',
    borderRadius: 5,
    marginRight: 10,
    elevation: 5,
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2
  },
});