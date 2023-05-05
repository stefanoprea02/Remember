import React, {useState} from "react";
import { Animated, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import InputError from "./InputError";
import { validText320 } from "../util/Validations";

export default function RecordingSettings({ recording, onSave }){
    if(recording === undefined)
      recording = {
        title: '',
        notes: ''
      }
    const [recordingSetting, setRecordingSetting] = useState(recording);
    const handleInputChange = (settingName, text) => {
        setRecordingSetting({...recordingSetting, [settingName]: text});
    };
  
    const [errors, setErrors] = useState(null);
  
    const handleSave = () => {
      let errs = [];
      errs.push(validText320(recordingSetting.title, "Title"));
      errs = errs.filter(e => e !== undefined);
      if(errs.length != 0)
        setErrors(errs);
      else
        onSave(recordingSetting);
    };
  
    const handleDelete = () => {
      onSave(null);
    }
  
    return (
      <View style={styles.containerModal}>
        <View>
          <Text style={styles.Label}>Title</Text>
          <TextInput 
            value={recordingSetting.title} 
            onChangeText={(text) => handleInputChange('title', text)}
            style={styles.textBoxes}
          />
        </View>
        <View>
          <Text style={styles.Label}>Notes</Text>
          <TextInput 
            value={recordingSetting.notes} 
            onChangeText={(notes) => handleInputChange('notes', notes)}
            style={[styles.textBoxes, {height: 150}]}
          />
        </View>
        {errors && <InputError errors={errors} key="Errors" />}
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
    padding: 11.75,
    marginBottom: 10,
    borderColor: '#4D5B9E',
    borderWidth: 0.2,
    textAlignVertical: "top",
  },
  TimeUnitStyles: {
    width: '60%',
    marginRight: 10,
  },
  PickerStyles: {
    fontSize: 18,
    padding: 8,
    borderColor: '#4D5B9E',
    borderWidth: 0.2,
    marginBottom: 10,
  }
});