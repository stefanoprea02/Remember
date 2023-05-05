import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { firebase, db } from './config';
import { useAuth } from '../hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from '@firebase/storage';
import { uuidv4 } from '@firebase/util';
import RecordingSettings from '../components/RecordingSettings';

export default function UploadRecording() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [selectedRecording, setSelectedRecording] = React.useState("");
  const [newRecording, setNewRecording] = useState(null);
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

    const fileId = uuidv4();
    const path = `Recordings/${user.uid}/${fileId}.${fileType}`;
    const recordRef = firebase.storage().ref(path);
  
    await recordRef.put(blob, {contentType: `audio/${fileType}`})
      .then(async (snapshot) => {
        const downloadURL = await recordRef.getDownloadURL()
          .then((recordUrl) => {
            const record = {
              id: fileId,
              title: "Untitled",
              notes: "",
              url: recordUrl
            }
            setNewRecording(record);
            setRecordings([...recordings, record]);
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

  async function saveToDB(updatedRecordings){
    const ref = doc(db, "users", user.uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const prevUser = docSnap.data();
      const a = await setDoc(doc(db, "users", user.uid),{
        ...prevUser,
        recordings: updatedRecordings
      });
    }
  }

  async function deleteAudio(index){
    const storage = getStorage();
    const desertRef = ref(storage, `Recordings/${user.uid}/${index}.3gp`);
    deleteObject(desertRef);

    const updatedRecordings = recordings.filter(function(item){
      return item.id !== index;
    });
    setRecordings(updatedRecordings);
    saveToDB(updatedRecordings);
  }

  async function handleSaveEditedRecording(editedRecording){
    let updatedRecordings;
    if(editedRecording === null){
      setSelectedRecording(null);
      deleteAudio(selectedRecording.id);
    }else{
      updatedRecordings = recordings.map((record) => (record.id === editedRecording.id ? editedRecording : record));  
      setRecordings(updatedRecordings);
      saveToDB(updatedRecordings);
      setSelectedRecording(null);
    }
  }

  let records = [];
  if(recordings){
    records = recordings.map((record) => {
      return (
        <View key={record.id} style={styles.row}>
          <View style={styles.recordingTextView}>
            <Text style={styles.recordingText}>{record.title}</Text>
          </View>
          <TouchableOpacity onPress={() => playAudio(record.id)}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Play</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedRecording(record)}>
            <Animated.View style={styles.DetailsStyles}>
              <Text style={styles.buttonText}>Details</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      );
    })
  }

  React.useEffect(() => {
    async function fetchData(){
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        let newRecordings = docSnap.data().recordings;
        newRecordings = [...recordings, newRecording];
        const prevUser = docSnap.data();
        const a = await setDoc(doc(db, "users", user.uid),{
          ...prevUser,
          recordings: newRecordings
        });
        setNewRecording(null);
      } 
    }
    if(newRecording && newRecording.url[0]==='h' && newRecording != recordings[recordings.length - 1])
      fetchData();
  }, [newRecording]);

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
      <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
          </Animated.View>
      </TouchableOpacity>
      {selectedRecording && (
        <Modal visible={true} animationType="slide">
          <RecordingSettings recording={selectedRecording} onSave={handleSaveEditedRecording} />
          <TouchableOpacity onPress={() => setSelectedRecording(null)}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
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
    backgroundColor: '#5B5A62',//'#4D5B9E',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 30,
    margin: 10,
    cursor: 'pointer',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    padding: 7,
    fontWeight: '600',
  },
  recordingText: {
    color: '#293264',
    fontSize: 18,
    padding: 7,
    fontWeight: '600',
  },
  recordingTextView: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  DetailsStyles: {
    backgroundColor: '#BFB4A8',//'#008450'
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
    margin: 10,
    cursor: 'pointer',
    alignItems: 'center',
  },
});