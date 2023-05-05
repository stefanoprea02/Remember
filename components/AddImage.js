import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TextInput, Animated, TouchableOpacity } from 'react-native';
import { firebase, db } from '../screens/config';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from "../hooks/useAuth";
import { uuidv4 } from '@firebase/util';
import { validText320 } from '../util/Validations';
import InputError from './InputError';

export default function AddImage({category, onSave}) {
    const [filename, setFileName] = useState('');
    const [image, setImage] = useState(null);
    const [id, setId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [scaleValue] = useState( new Animated.Value(1) );
    const [fadeValue] = useState( new Animated.Value(1) );
    const [user, setUser] = useState();
    const [errors, setErrors] = useState(null);
    const auth = useAuth();
    if(user === undefined){
      const string = JSON.stringify(auth.user)
      if(string){
        let parsed = JSON.parse(string);
        setUser(parsed);
      }
    }
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.uri);
      }
    };
  
    React.useEffect(() => {
      async function fetchData(){
        const ref = doc(db, "users", user.uid);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          const categories = docSnap.data().categories;
          categories[category] = [...categories[category], {
            id: id,
            title: filename,
            notes: "",
            url: image,
          }];
          const prevUser = docSnap.data();
          const a = await setDoc(doc(db, "users", user.uid),{
            ...prevUser,
            categories: categories
          });
        } 
      }
      if(image && image[0]==='h')
        fetchData();
    }, [image]);  
  
    const uploadImage = async () => {
      let errs = [];
      errs.push(validText320(filename, "Title"));
      if(image === null)
        errs.push("You must first select an image");

      errs = errs.filter(e => e !== undefined);
      if(errs.length != 0)
        setErrors(errs);
      else{
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', image, true);
          xhr.send(null);
        })
        const fileId = uuidv4();
        setId(fileId);
        const ref = firebase.storage().ref().child(`Memories/${user.uid}/${fileId}.image`)
        const snapshot = ref.put(blob)
        snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
          ()=>{
            setUploading(true)
          },
          (error) => {
            setUploading(false)
            console.log(error)
            blob.close()
            return 
          },
          () => {
            snapshot.snapshot.ref.getDownloadURL().then((url) => {
              setUploading(false)
              setImage(url)
              blob.close()
              return url;
            })
          }
        )
      }
    };
  
    return (  
      <View style={[styles.container, {justifyContent: 'center'}]}> 
        {image && <Image source={{uri: image}} style={{width: 170 , height: 200}}/>}
        <TouchableOpacity onPress={pickImage}>
          <Animated.View style={[styles.button, { transform : [{ scale: scaleValue }]}]}>
            <Text style={styles.buttonText}>Select Picture</Text>
          </Animated.View>
        </TouchableOpacity>
        <TextInput value={filename} onChangeText={(filename) => {setFileName(filename)}} placeholder="Add title for your pic" style={styles.textBoxes}></TextInput>
        {!uploading ? 
          <TouchableOpacity onPress={uploadImage}>
            <Animated.View style={[styles.button, { opacity: fadeValue }]}>
            <Text style={styles.buttonText}>Upload Picture</Text>
            </Animated.View>
          </TouchableOpacity> : <ActivityIndicator size={'small'} color='black' />
        }
        {errors && <InputError errors={errors} key="Errors" />}
        <TouchableOpacity onPress={() => {onSave(false)}}>
          <Animated.View style={styles.exitButton}>
            <Text style={styles.buttonText}>Exit</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
    },
    textBoxes: {
      maxWidth: '90%',
      minWidth: '90%',
      fontSize: 18,
      padding: 12,
      borderColor: '#4D5B9E',
      borderWidth: 0.2,
      borderRadius: 10,
      marginBottom: 10,
    },
    button: {
      //flex: 1,
      backgroundColor: '#5B5A62',
      paddingVertical: 5,
      borderRadius: 30,
      margin: 10,
      cursor: 'pointer',
      alignItems: 'center',
      minWidth: '90%'
    },
    exitButton: {
      backgroundColor: '#e34234',
      paddingVertical: 5,
      paddingHorizontal: 20,
      borderRadius: 30,
      margin: 10,
      cursor: 'pointer',
      alignItems: 'center',
      opacity: 0.8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      padding: 7,
    },
});
  