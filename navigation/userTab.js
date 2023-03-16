import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";

import Home from "../screens/Home";
import SliderBar from "../screens/SliderBar";
import Dailies from "../screens/Dailies";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          "tabBarActiveTintColor": "#293264",
          "tabBarInactiveTintColor": "gray",
          "tabBarLabelStyle": {
              "fontSize": 14,
              "fontWeight": "bold",
              "marginBottom": 4
          },
          "tabBarStyle": [
              {
                "display": "flex",
                "padding": 5,
                "height": 55
              },
              null
          ]
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Dailies"
          component={Dailies}
          options={{
            tabBarLabel: "Dailies",
            tabBarIcon: ({ color }) => (
              <Feather name="calendar" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SliderBar"
          component={SliderBar}
          options={{
            tabBarLabel: "Slider Bar",
            tabBarIcon: ({ color }) => (
              <Feather name="sliders" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
