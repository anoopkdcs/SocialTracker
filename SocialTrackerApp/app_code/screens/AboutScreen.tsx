import { View, Text, Image, StyleSheet } from "react-native";

const AboutScreen = () => {
    return(
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Image source={require("../assets/images/app-welcome-image.png")} style={{ width: 100, height: 70, marginBottom: 20 }} />
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>DETECTMiND</Text>
        <Text style={styles.appAboutVersion}>Version: 1.0.0</Text>
        <Text style={styles.appAboutVersion}>© Anoop Kadan, 2025. All Rights Reserved</Text>
        <Text style={styles.appAboutContent}>
          <Text style={styles.appAboutAppName}> DETECTMiND</Text> is an Android-based pilot mobile app designed to collect data on mobile phone usage, including call counts, call durations, app usage, and screen time. This information may help identify young people who are at a higher risk of developing mental health issues. It is important to note that the app does not collect information about the websites visited or the content of any conversations, messages, or shared information
        </Text>
        <Text style={styles.appBottomWarning}>
          Using this app for any other purpose without the author's permission is illegal and prohibited.
        </Text>
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


  export default AboutScreen