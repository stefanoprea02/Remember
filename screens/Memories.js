import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated, Modal, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { useAuth } from "../hooks/useAuth";
import AddImage from '../components/AddImage';
import Category from '../components/Category'

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
              <AddImage category={selectedCategory} onSave={addImageSet}/>
            </View>
          )
           : 
          (
            <View>
              <ScrollView>
                <View style={styles.images}>
                  {images}
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
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column'
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
      width:'95%'
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
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
  