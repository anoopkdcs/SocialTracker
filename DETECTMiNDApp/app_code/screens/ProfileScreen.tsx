import { getUser, updateUser } from "@/db/init";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

const ProfileScreen = () => {

  const [code, setCode] = useState("");
  const [userId, setUserId] = useState(0);

   const router = useRouter();

    const updateProfile = async ()=>{

      await updateUser(userId, code)
      router.replace("/app")
    }

    useEffect(()=>{
      const init = async ()=>{
        let user:any = await getUser()
        if(user){
          setUserId(user.id)
          setCode(user.name)
        }
      }

      init()
    },[])

    return(
      <View style={{ backgroundColor: "white", flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Welcome to DETECT MiND</Text>
        <Image source={require("../assets/images/app-welcome-image.png")} style={{ width: 140, height: 100, marginBottom: 10 }} />
        <Text style={{ fontWeight: 700, fontSize: 14, textAlign: "center", marginTop: 5 }}>Update your account</Text>
      </View>
      <View style={{width: "100%",  alignItems: "center"}}>
        <TextInput value={code} placeholder="six digit code" onChangeText={setCode} style={{ borderWidth: 1, padding: 0, width: "80%", marginBottom: 20, borderRadius: 6 }} />
        <Button mode="contained" style={{width: "80%", borderRadius: 8, backgroundColor: "black"}} onPress={async () => await updateProfile()}>Update</Button>
        <Text style={{ marginTop: 30, color: "red" }}>How to create your six digit code</Text>
        <Text style={{textAlign: "left", marginTop: 20, width: "90%"}}>
          What The <Text style={{fontWeight: 600}}>six digit code</Text> is the combination of the first two letters of your last name and the last 4 digits of your phone number
        </Text>
        <View style={{ width: "90%", alignContent: "flex-start", marginTop: 20 }}>
          <Text>A sample six digit code creation </Text>
          <Text>Name: David <Text style={{fontWeight: 700}}>Sm</Text>ith</Text>
          <Text>Phone number: 0767712<Text style={{fontWeight: 700}}>5689</Text></Text>
          <Text>Your six digit code is: <Text style={{fontWeight: 700}}>SM5689</Text> </Text>
        </View>
      </View>
    </View>
    )
  };


  const styles = StyleSheet.create({
    
    appAboutVersion:{
       fontSize: 16, 
       marginTop: 0
    },
    appAboutContent: {
      fontSize: 14,
      marginTop: 40,
      textAlign: "center",
      justifyContent:"center",

    },
    appAboutAppName: {
      fontWeight: 600
    },
    appBottomWarning: {
      position: "absolute",
      bottom: 20,
      color: "red",
      textAlign: "center"
    }

  })


  export default ProfileScreen