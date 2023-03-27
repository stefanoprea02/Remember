import React from 'react';
import * as Notifications from 'expo-notifications';

const PushNotificationContext = React.createContext(null);

/*notification structure :
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };
*/
export async function sendPushNotification(message) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  
  /*call example
  schedulePushNotification({
    content: {
        to: expoPushToken,
        sound: 'default',
        title: 'title',
        body: 'body',
        data: 'data',
    },
    trigger:{
        seconds: secs,
        channelId: 'default'
    },
  });
  */
  export async function schedulePushNotification(data) {
    const id = await Notifications.scheduleNotificationAsync(data);
    return id;
  }

export default PushNotificationContext;