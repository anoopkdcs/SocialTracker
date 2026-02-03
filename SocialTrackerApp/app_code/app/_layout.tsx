import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, AppState, PermissionsAndroid, NativeModules, Platform, Alert } from "react-native";
import { Button, BottomNavigation, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer, DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DBInit, hasUser } from "@/db/init";
import GenerateCodeScreen from "@/screens/GenerateCodeScreen";
import { requestPermission } from "@/util/permission";
import Index from "./index";
import Code from "./code";
import * as MediaLibrary from 'expo-media-library'
import { requestStoragePermission } from "@/util/persmission";


SplashScreen.preventAutoHideAsync();



export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { MyKotlinModule } = NativeModules;
  const router = useRouter();

  useEffect(()=>{
   
    const init = async ()=>{
      await DBInit();
      await requestPermission(PermissionsAndroid.PERMISSIONS.READ_CALL_LOG)
      await MediaLibrary.requestPermissionsAsync();

      await requestStoragePermission()
      const isGranted = await MyKotlinModule.checkPermission();
      if (!isGranted) {
        Alert.alert(
            "Permission Required",
            "This app needs access to app usage stats. Please enable it in settings.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: () => MyKotlinModule.openUsageSettings() }
            ]
        );
      }
      const exists = await hasUser();
      if(exists){
        router.replace("/app")
      }else{
        router.replace("/code")
      }
      
    }

    init()
    setTimeout(()=>{
       SplashScreen.hideAsync();
    }, 1000)

  }, [])

  return(
   <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="app" options={{ headerShown: false }} />
          <Stack.Screen name="code" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
  )

}
