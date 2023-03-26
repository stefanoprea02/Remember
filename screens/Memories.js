import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated, Modal, ScrollView, Button } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { useAuth } from "../hooks/useAuth";
import AddImage from '../components/AddImage';
import Category from '../components/Category';
import { getStorage, ref, deleteObject } from '@firebase/storage';
import MemorySettings from "../components/MemorySettings";

export default function Memories() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [images, setImages] = useState([]);
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

  const addImageSet = (value) => {
    setAddImage(value);
  }

  React.useEffect(() => {
    async function fetchData(){
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists() && selectedCategory != '') {
        setImages(docSnap.data().categories[selectedCategory]);
      }
    }
    if(selectedCategory != '')
      fetchData();
  }, [selectedCategory, addImage]);

  async function saveToDB(updatedImages){
    const ref = doc(db, "users", user.uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      let cat = docSnap.data().categories;
      cat[selectedCategory] = updatedImages;

      const prevUser = docSnap.data();
      const a = await setDoc(doc(db, "users", user.uid),{
        ...prevUser,
        categories: cat
      });
    }
  }

  async function deleteImage(index){
    const storage = getStorage();
    const desertRef = ref(storage, `Memories/${user.uid}/${index}.image`);
    deleteObject(desertRef);

    const updatedImages = images.filter(function(item){
      return item !== selectedMemory;
    });
    setImages(updatedImages);
    setSelectedMemory(null);
    saveToDB(updatedImages);
  }

  async function handleSaveEditedMemory(editedMemory){
    if(editedMemory === null){
      deleteImage(selectedMemory.id);
    }else{
      const updatedImages = images.map((image) => (image.id === editedMemory.id ? editedMemory : image));
      setImages(updatedImages);
      setSelectedMemory(null);
      saveToDB(updatedImages);
    }
  }

  let imgs = [];
  if (images) {
    imgs = images.map((img, index) => {
      return (
        <TouchableWithoutFeedback onPress={() => setSelectedMemory(img)} key={index}>
          <Image source={{ uri: img.url }} style={styles.logo} />
        </TouchableWithoutFeedback>
      )
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
              <AddImage category={selectedCategory} onSave={addImageSet}/>
            </View>
          )
           : 
          (
            <View>
              <ScrollView>
                <View style={styles.images}>
                  {imgs}
                </View>
              </ScrollView>
              <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
                <TouchableWithoutFeedback onPress={() => {setAddImage(true)}}>
                  <Animated.View style={styles.button}>
                    <Text style={styles.buttonText}>Add Image</Text>
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {setSelectedCategory('')}}>
                  <Animated.View style={styles.button}>
                    <Text style={styles.buttonText}>Select Category</Text>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
        </View>
      )
      }
      {selectedMemory && (
        <Modal visible={true} animationType="slide">
          <MemorySettings memory={selectedMemory} onSave={handleSaveEditedMemory} />
          <TouchableWithoutFeedback onPress={() => setSelectedMemory(null)}>
            <Animated.View style={styles.button2}>
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
      alignItems: 'center'
    },
    button: {
      //flex: 1,
      backgroundColor: '#4D5B9E',
      borderRadius: 5,
      marginVertical: 5,
      elevation: 5,
      cursor: 'pointer',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
      paddingVertical: 2,
      width:'95%'
    },
    button2: {
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
    buttonText: {
      color: '#fff',
      fontSize: 17,
      padding: 7,
    },
    logo: {
      width: 150,
      height: 150,
      margin: 10
    },
    images: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flex: 1,
    }
  });
  