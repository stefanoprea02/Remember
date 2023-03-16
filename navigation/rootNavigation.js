import React from "react";
import { db } from "../screens/config";
import { useAuth } from "../hooks/useAuth";
import AuthStack from "./authStack";
import UserStack from "./userStack";
import SignUp from "../screens/SignUp";
import Home from "../screens/Home";

export default function RootNavigation(){
    const { user } = useAuth();

    return user ? <UserStack /> : <AuthStack />
}