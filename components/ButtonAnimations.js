import React from "react";
import { Animated } from "react-native";

export function animateButton(scaleValue){
    Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
    }).start(() => {
    Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        }).start();
    })
};

export function animateButton2(fadeValue){
    Animated.sequence([
        Animated.timing(fadeValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        })
    ]).start();
};