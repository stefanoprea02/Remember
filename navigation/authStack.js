import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignUp from "../screens/SignUp";
const Stack = createStackNavigator();

export default function AuthStack(){
    return (
        <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen name="SignUp" component={SignUp}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}