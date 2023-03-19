import React from "react";
import { db } from "../screens/config";
import { useAuth } from "../hooks/useAuth";
import AuthStack from "./authStack";
import SignUp from "../screens/SignUp";
import Home from "../screens/Home";
import UserTab from "./userTab"

export default function RootNavigation(){
    const { user } = useAuth();

    return user ? <UserTab /> : <AuthStack />
}