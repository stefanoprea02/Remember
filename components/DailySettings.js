import React, {useState} from "react";
import { Animated, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Dropdown } from "react-native-element-dropdown";
import { validText320, validNumber } from "../util/Validations";
import InputError from "./InputError";

export default function DailySettings({ daily, onSave }){
    const time = new Date().toISOString();
    if(daily === undefined){
      daily = {
        id: '',
        title: '',
        notes: '',
        completed: time,
        timeUnit: 'Days',
        timeValue: '',
        notificationId: ''
      }
    }else{
      daily = {
        ...daily,
        completed: time
      }
    }
    const [dailySetting, setDailySetting] = useState(daily);
    const handleInputChange = (settingName, text) => {
      setDailySetting({...dailySetting, [settingName]: text});
    };
  
    const [errors, setErrors] = useState(null);
  
    const handleSave = () => {
      let errs = [];
      errs.push(validText320(dailySetting.title, "Title"));
      errs.push(validNumber(dailySetting.timeValue, "How often"));
      errs = errs.filter(e => e !== undefined);
      if(errs.length != 0)
        setErrors(errs);
      else
        onSave(dailySetting);
    };
  
    const handleDelete = () => {
      onSave(null);
    }
  
    return (
      <View style={styles.containerModal}>
        <View>
          <Text style={styles.Label}>Title</Text>
          <TextInput 
            value={dailySetting.title} 
            onChangeText={(text) => handleInputChange('title', text)}
            style={styles.textBoxes}
          />
        </View>
        <View>
          <Text style={styles.Label}>Notes</Text>
          <TextInput 
            value={dailySetting.notes} 
            onChangeText={(text) => handleInputChange('notes', text)}
            style={[styles.textBoxes, {height: 150}]}
            multiline={true}
          />
        </View>
          <View style={styles.TimeStyles}>
          <View style={styles.TimeUnitStyles}>
            <Text style={styles.Label}>Time unit</Text>
            <Dropdown
              selectedValue={dailySetting.timeUnit}
              onChange={(text) => handleInputChange('timeUnit', text.value)}
              style={styles.PickerStyles}
              inputSearchStyle={styles.textBoxes}
              data={[
                { value: "Minutes", label: "Minutes" },
                { value: "Hours", label: "Hours" },
                { value: "Days", label: "Days" },
                { value: "Weeks", label: "Weeks" },
              ]}
              labelField="label"
              valueField="value"
              maxHeight={300}
              value={dailySetting.timeUnit}
            />
          </View>
          <View style={styles.TimeValueStyles}>
            <Text style={styles.Label}>How often</Text>
            <TextInput 
              value={dailySetting.timeValue} 
              onChangeText={(text) => handleInputChange('timeValue', text)}
              style={styles.TimeValueInput}
              keyboardType="numeric"
          />
          </View>
        </View>
        {errors && <InputError errors={errors} key="Errors" />}
        <View style={styles.TimeStyles}>
          <TouchableOpacity onPress={handleSave}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Animated.View style={styles.DeleteStyles}>
              <Text style={styles.buttonText}>Delete</Text>
            </Animated.View>
          </TouchableOpacity>
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