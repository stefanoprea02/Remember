import React, { useState } from "react";
import { Animated, Button, FlatList, Modal, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { StyleSheet } from "react-native";

const DailySettings = ({ daily, onSave }) => {
  const time = new Date();
  time.setDate(time.getDate() - 1);
  const newTime = time.toISOString();
  if(daily === undefined)
    daily = {
      title: '',
      notes: '',
      completed: newTime
    }
  const [dailySetting, setDailySetting] = useState(daily);

  const handleInputChange = (settingName, text) => {
    setDailySetting({...dailySetting, [settingName]: text});
  };

  const handleSave = () => {
    onSave(dailySetting);
  };

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
      </View>

      <TouchableWithoutFeedback onPress={handleSave}>
        <Animated.View style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default function Dailies(){
    const [showSettings, setShowSettings] = useState(false);
    const [dailies, setDailies] = useState([]);
    const [selectedDaily, setSelectedDaily] = useState(null);

    const handleOpenSettings = () => {
      setShowSettings(true);
    };

    const handleCloseSettings = () => {
      setShowSettings(false);
    };

    const handleSaveDaily = (dailySetting) => {
      const newDaily = {
        id: dailies.length + 1,
        title: dailySetting.title,
        notes: dailySetting.notes,
        completed: dailySetting.completed
      };
      setDailies([...dailies, newDaily]);
      handleCloseSettings();
    };

    const handleEditDaily = (daily) => {
      setSelectedDaily(daily);
    }

    const handleSaveEditedDaily = (editedDaily) => {
      const updatedDailies = dailies.map((daily) => (daily.id === editedDaily.id ? editedDaily : daily));
      setDailies(updatedDailies);
      setSelectedDaily(null);
    }

    const completeDaily = (item) => {
      const time = new Date().toISOString();
      const updatedDailies = dailies.map((daily) => (daily.id === item.id ? {...daily, completed: time} : daily));
      setDailies(updatedDailies);
    }

    const renderDailyItem = ({ item }) => {
      const date1 = new Date(item.completed);
      const date2 = new Date();

      const timeDiff = Math.abs(date2.getTime() - date1.getTime());
      const timeDiffInSecs = Math.floor(timeDiff / 1000);
      if (timeDiffInSecs >= 86399) {
        return (
          <View style={styles.DailyStyle}>
            <TouchableWithoutFeedback onPress={() => handleEditDaily(item)}>
              <Animated.View style={styles.LeftSide}>
                <Text style={styles.Text}>{item.title}</Text>
                <Text style={styles.Notes}>{item.notes}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => completeDaily(item)}>
              <Animated.View style={styles.RightSide}>
                <View style={styles.CompleteStyle}></View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        )
      } else {
        return (
          <View style={styles.DailyStyle}>
            <TouchableWithoutFeedback>
              <Animated.View style={styles.LeftSide}>
                <Text style={styles.Text}>{item.title}</Text>
                <Text style={styles.Notes}>{item.notes}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <Animated.View style={styles.RightSideComplete}>
                <View style={styles.CompleteCompleteStyle}></View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        )
      }
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={dailies}
          renderItem={renderDailyItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
  
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={handleOpenSettings}>
              <Animated.View style={styles.button}>
                <Text style={styles.buttonText}>Add Daily</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
        </View>
  
        <Modal visible={showSettings} animationType="slide">
          <DailySettings onSave={handleSaveDaily} />
          <TouchableWithoutFeedback onPress={handleCloseSettings}>
            <Animated.View style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>

        {selectedDaily && (
          <Modal visible={true} animationType="slide">
            <DailySettings daily={selectedDaily} onSave={handleSaveEditedDaily} />
            <TouchableWithoutFeedback onPress={() => setSelectedDaily(null)}>
              <Animated.View style={styles.button}>
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
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
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
  DailyStyle:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    marginVertical: 10,
  },
  LeftSide: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    cursor: 'pointer',
    paddingLeft: 15,
    paddingVertical: 10,
    width: '70%',
    height: '100%'
  },
  RightSide: {
    backgroundColor: '#4D5B9E',
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  CompleteStyle:{
    backgroundColor: '#7587e0',
    width: 40,
    height: 40,
    borderRadius: 10
  },
  RightSideComplete: {
    backgroundColor: '#418a3b',
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  CompleteCompleteStyle:{
    backgroundColor: '#418a3b',
    width: 40,
    height: 40,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    padding: 7,
  },
  Text: {
    color: '#4D5B9E',
    fontSize: 20,
    padding: 0,
  },
  Notes: {
    color: '#4D5B9E',
    fontSize: 14,
    padding: 0,
  },
  Label:{
    color: '#4D5B9E',
    fontSize: 17,
    padding: 2,
    fontWeight: 500
  },
  InputView: {
    backgroundColor: '#7587e0'
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
});