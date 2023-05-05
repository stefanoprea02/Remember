import React, {useState} from "react";
import { Animated, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Image } from 'react-native';

export default function MemorySettings({ memory, onSave }){
    if(memory === undefined)
    memory = {
        title: '',
        notes: ''
      }
    const [memorySetting, setMemorySetting] = useState(memory);
    const handleInputChange = (settingName, text) => {
        setMemorySetting({...memorySetting, [settingName]: text});
    };
  
    const handleSave = () => {
      onSave(memorySetting);
    };
  
    const handleDelete = () => {
      onSave(null);
    }
  
    return (
      <View style={styles.containerModal}>
        {memory.url && <Image source={{uri: memory.url}} style={{width: '90%' , height: '40%', marginBottom: 10}}/>}
        <View>
          <Text style={styles.Label}>Title</Text>
          <TextInput 
            value={memorySetting.title} 
            onChangeText={(text) => handleInputChange('title', text)}
            style={styles.textBoxes}
          />
        </View>
        <View>
          <Text style={styles.Label}>Notes</Text>
          <TextInput 
            value={memorySetting.notes} 
            onChangeText={(notes) => handleInputChange('notes', notes)}
            style={[styles.textBoxes, {height: 150}]}
            multiline={true}
          />
        </View>
        <View style={styles.TimeStyles}>
          <TouchableWithoutFeedback onPress={handleSave}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={handleDelete}>
            <Animated.View style={styles.DeleteStyles}>
              <Text style={styles.buttonText}>Delete</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
};

  const styles = StyleSheet.create({
    containerModal: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
    DeleteStyles: {
      backgroundColor: '#E68587',//'#e34234',
      paddingVertical: 5,
      paddingHorizontal: 20,
      borderRadius: 30,
      margin: 10,
      cursor: 'pointer',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      padding: 7,
      fontWeight: '600',
    },
    Label:{
      color: '#918980',//'#4D5B9E',
      fontSize: 17,
      padding: 2,
      fontWeight: '700',
    },
    textBoxes: {
      maxWidth: "91%",
      minWidth: "91%",
      fontSize: 18,
      padding: 12,
      borderColor: '#4D5B9E',
      borderWidth: 0.2,
      borderRadius: 10,
      marginBottom: 10,
      textAlignVertical: 'top',
    },
    TimeStyles: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    TimeValueStyles: {
      width: '30%',
    },
    TimeValueInput: {
      fontSize: 18,
      padding: 14,
      marginBottom: 10,
      borderColor: '#4D5B9E',
      borderWidth: 0.2,
      textAlignVertical: "top"
    },
    TimeUnitStyles: {
      width: '60%'
    },
    PickerStyles: {
      fontSize: 18,
      padding: 8,
      borderColor: '#4D5B9E',
      borderWidth: 0.2,
      marginBottom: 10,
    }
});