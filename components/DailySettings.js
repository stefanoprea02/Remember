import React, {useState} from "react";
import { Animated, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Dropdown } from "react-native-element-dropdown";


export default function DailySettings({ daily, onSave }){
    const time = new Date();
    const newTime = time.toISOString();
    if(daily === undefined)
      daily = {
        title: '',
        notes: '',
        completed: newTime,
        timeUnit: 'Days',
        timeValue: ''
      }
    const [dailySetting, setDailySetting] = useState(daily);
    const handleInputChange = (settingName, text) => {
      setDailySetting({...dailySetting, [settingName]: text});
    };
  
    const handleSave = () => {
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
            style={[styles.textBoxes, {height: 100}]}
            multiline={true}
          />
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