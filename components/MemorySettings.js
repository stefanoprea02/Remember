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
    DeleteStyles: {
      backgroundColor: '#e34234',
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
      fontSize: 18,
      padding: 7,
    },
    Label:{
      color: '#4D5B9E',
      fontSize: 17,
      padding: 2,
      fontWeight: 500
    },
    textBoxes: {
      maxWidth: 350,
      minWidth: 350,
      fontSize: 18,
      padding: 12,
      marginBottom: 10,
      borderColor: '#4D5B9E',
      borderWidth: 0.2,
      textAlignVertical: "top"
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