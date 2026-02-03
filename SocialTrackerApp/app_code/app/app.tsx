import { useState } from "react";
import { Button, BottomNavigation, Provider as PaperProvider } from "react-native-paper";
import HomeScreen from "@/screens/HomeScreen";
import CallLogScreen from "@/screens/CallLogScreen";
import AppUsageScreen from "@/screens/AppUsageScreen";
import ScreenTimeScreen from "@/screens/ScreenTimeScreen";
import AboutScreen from "@/screens/AboutScreen";
import { getDateinMileSecTillNow } from "@/util/date";
import { NativeModules } from "react-native";
import { WHITELIST_APP } from "@/const/whitlistApp";
import { insertOrUpdateAppUsage, insertOrUpdateCallLog } from "@/db/init";
// @ts-ignore


const  App = ()=> {

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", title: "Home", focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: "calllog", title: "Call Log", focusedIcon: 'phone', unfocusedIcon: 'phone-outline' },
    { key: "appusage", title: "App Usage", focusedIcon: "apps-box", unfocusedIcon: "apps"},
    { key: "screentime", title: "Screen Time", focusedIcon: 'clock-time-four', unfocusedIcon: 'clock-time-four-outline' },
    { key: "info", title: "Info", focusedIcon: 'information', unfocusedIcon: 'information-outline' }
  ]);
  
  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    calllog: CallLogScreen,
    appusage: AppUsageScreen,
    screentime: ScreenTimeScreen,
    info: AboutScreen
  });
  
 return <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />

}

export default App



