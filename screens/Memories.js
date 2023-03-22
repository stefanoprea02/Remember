import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, ActivityIndicator, TextInput, TouchableWithoutFeedback, Animated, Modal, TouchableHighlight, ScrollView } from 'react-native';
import { app, firebase } from './config';
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, setDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { useAuth } from "../hooks/useAuth";

const Category = ({onSave}) => {
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

const AddImage = ({category, images, onSave}) => {
  const [filename, setFileName] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scaleValue] = useState( new Animated.Value(1) );
  const [fadeValue] = useState( new Animated.Value(1) );
  const [user, setUser] = useState();
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

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  React.useEffect(() => {
    async function fetchData(){
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const categories = docSnap.data().categories;
        categories[category] = [...categories[category], image];
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
    const ref = firebase.storage().ref().child(`Memories/` + filename)
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
  };

  return (  
    <View style={[styles.container, {justifyContent: 'center'}]}> 
      {image && <Image source={{uri: image}} style={{width: 170 , height: 200}}/>}
      <TouchableWithoutFeedback onPress={pickImage}>
        <Animated.View style={[styles.button, { transform : [{ scale: scaleValue }]}]}>
          <Text style={styles.buttonText}>Select Picture</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
      <TextInput value={filename} onChangeText={(filename) => {setFileName(filename)}} placeholder="File Name" style={styles.textBoxes}></TextInput>
      {!uploading ? 
        <TouchableWithoutFeedback onPress={uploadImage}>
          <Animated.View style={[styles.button, { opacity: fadeValue }]}>
          <Text style={styles.buttonText}>Upload Picture</Text>
          </Animated.View>
        </TouchableWithoutFeedback> : <ActivityIndicator size={'small'} color='black' />
      }
      <TouchableWithoutFeedback onPress={() => {onSave(false)}}>
        <Animated.View style={styles.button}>
          <Text style={styles.buttonText}>Exit</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default function Memories() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageLinks, setImageLinks] = useState([]);
  const [addImage, setAddImage] = useState(false);
  const [user, setUser] = useState();
  const auth = useAuth();
  if(user === undefined){
    const string = JSON.stringify(auth.user)
    if(string){
      let parsed = JSON.parse(string);
      setUser(parsed);
    }
  }

  async function handleSaveCategory(category){
    setSelectedCategory(category);
  }

  React.useEffect(() => {
    async function fetchData(){
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists() && selectedCategory != '') {
        setImageLinks(docSnap.data().categories[selectedCategory]);
      }
    }
    if(selectedCategory != '')
      fetchData();
  }, [selectedCategory, addImage]);

  const addImageSet = (value) => {
    setAddImage(value);
  }

  let images = [];
  if (imageLinks) {
    images = imageLinks.map((link, index) => {
      return <Image key={index} source={{ uri: link }} style={styles.logo} />
    });
  }

  return (
    <View style={styles.container}>
      {selectedCategory === '' ? (
        <Modal visible={true} animationType="slide">
          <Category onSave={handleSaveCategory} />
        </Modal>
      ) : (
        <View>
          {addImage === true ? (
            <View>
              <AddImage category={selectedCategory} images={imageLinks} onSave={addImageSet}/>
            </View>
          )
           : 
          (
            <View>
              <View style={styles.images}>
                {images}
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
                <TouchableWithoutFeedback onPress={() => {setSelectedCategory('')}}>
                  <Animated.View style={styles.button}>
                    <Text style={styles.buttonText}>Select Category</Text>
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {setAddImage(true)}}>
                  <Animated.View style={styles.button}>
                    <Text style={styles.buttonText}>Add Image</Text>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )
          }
          
        </View>
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column'
    },
    innerContainer:{
      width: '100%'
    },
    containerModal: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 10,
      flexDirection: 'row',
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
      backgroundColor: '#4D5B9E',
      borderRadius: 5,
      margin: 10,
      elevation: 5,
      cursor: 'pointer',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
      paddingVertical: 2,
      width:'90%'
    },
    buttonText: {
      color: '#fff',
      fontSize: 20,
      padding: 7,
    },
    logo: {
      width: 150,
      height: 150,
      margin: 10
    },
    img: {
      width: '95%',
      height: 250,
      resizeMode: 'contain',
    },
    images: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flex: 1
    }
  });
  