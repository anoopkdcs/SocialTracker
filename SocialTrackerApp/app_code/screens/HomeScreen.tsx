import { APP_USAGE_PIE_CHART_COLORS, CALL_DURATION_PIE_CHART_COLORS, CALL_OUT_PIE_CHART_COLORS } from "@/const/colors";
import { WHITELIST_APP } from "@/const/whitlistApp";
import { getAllCallLogs, getAppUsage, getCallCount, getCallDuration, getLastWeekScreenUsage, getSceenTime, getTotalAppUsage, getUser } from "@/db/init";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, TouchableOpacity, PermissionsAndroid } from "react-native"
import { BarChart, PieChart } from "react-native-chart-kit";
import { Appbar, Button } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Feather } from '@expo/vector-icons';
import { requestStoragePermission } from "@/util/persmission";
import { requestPermission } from "@/util/permission";
import * as MediaLibrary from 'expo-media-library'
import { useRouter } from "expo-router";
import updateDBData from "@/util/DBFunc";
// import CallLogs from "react-native-call-log";


const PieChartCustomLegend = ({ data }: any) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
    {data.map((item: any, index: number) => (
      <View key={index} style={{ flexDirection: "row", alignItems: "center", margin: 5 }}>
        <View style={{ width: 10, height: 10, backgroundColor: item.color, marginRight: 5, borderRadius: 100 }} />
        <Text style={{ fontSize: 12, color: "#7F7F7F" }}>{item.name} ({item.population})</Text>
      </View>
    ))}
  </View>
);

const PieChartRightCustomLegend = ({ data }: any) => (
  <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
    {data.map((item: any, index: number) => (
      <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
        <View style={{ width: 10, height: 10, backgroundColor: item.color, marginRight: 5 }} />
        <Text style={{ color: item.legendFontColor, fontSize: item.legendFontSize }}>
          {item.name}
        </Text>
      </View>
    ))}
  </View>
);


const HomeScreen = () => {

  const screenWidth = Dimensions.get("window").width;


  const [callData, setCallData] = useState<any>([])
  const [durationData, setDurationData] = useState<any>([])
  const [usageData, setUsageData] = useState<any>([])
  const [screenTime, setScreenTime] = useState<any>({ labels: [], data: [] })

  const router = useRouter();

  const exelData = [
    ["User", "Date", "Incoming Call Count", "Outgoing Call Count", "Missed Call Count", "Rejected Call Count", "Incoming Call Duration", "Outgoing Call Duration", "WhatsApp", "WhatsApp  Business", "Instagram", "Facebook", "Facebook Messenger", "Snapchat", "YouTube", "TikTok", "WeChat", "Discord", "Kuaishou", "X", "Sina Weibo", "QQ", "Spotify", "YouTube Music", "Pinterest", "Netflix", "LinkedIn", "Bluesky", "Overall App Usage", "Screen time"]
  ];

  const pieChartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const barChartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };



  const createExcelData = async () => {

    let excelObj: any = {}
    let labels = {
      "incoming_call_count": 0,
      "outgoing_call_count": 0,
      "missed_call_count": 0,
      "rejected_call_count": 0,
      "incoming_call_duration": 0,
      "outgoing_call_duration": 0,

      "com.whatsapp": 0,
      "com.whatsapp.w4b": 0,
      "com.instagram.android": 0,
      "com.facebook.katana": 0,
      "com.facebook.orca": 0,
      "com.snapchat.android": 0,
      "com.google.android.youtube": 0,
      "com.zhiliaoapp.musically": 0,
      "com.tencent.mm": 0,
      "com.discord": 0,
      "com.kuaishou.ks": 0,
      "com.twitter.android": 0,
      "com.sina.weibo": 0,
      "com.tencent.mobileqq": 0,
      "com.spotify.music": 0,
      "com.google.android.apps.youtube.music": 0,
      "com.pinterest": 0,
      "com.netflix.mediaclient": 0,
      "com.linkedin.android": 0,
      "xyz.blueskyweb.app": 0,

      "overall_app_usage": 0,
      "screen_time": 0,

    }
    let callLogs = await getAllCallLogs()
    callLogs?.map((item: any) => {
      if (!excelObj[item.date]) {
        excelObj[item.date] = JSON.parse(JSON.stringify(labels))
      }
      excelObj[item.date]["incoming_call_count"] = item.incoming_count
      excelObj[item.date]["outgoing_call_count"] = item.outgoing_count
      excelObj[item.date]["missed_call_count"] = item.missed_count
      excelObj[item.date]["rejected_call_count"] = item.reject_count
      excelObj[item.date]["incoming_call_duration"] = item.incoming_duration
      excelObj[item.date]["outgoing_call_duration"] = item.outgoing_duration
      console.log(`"----excelObj-${item.date}-----"`)
      console.log({ excelObj, item })
      console.log(`"----excelObj-${item.date}-----"`)
    })



    let appUsage = await getAppUsage()
    appUsage?.map((item: any) => {
      if (!excelObj[item.date]) {
        excelObj[item.date] = JSON.parse(JSON.stringify(labels))
      }
      if (WHITELIST_APP[item.app_package]) {
        excelObj[item.date][item.app_package] = item.usage_time
        // excelObj[item.date]["overall_app_usage"] = excelObj[item.date]["overall_app_usage"] = item.usage_time
      }
      excelObj[item.date]["overall_app_usage"] = parseInt(excelObj[item.date]["overall_app_usage"]) + parseInt(item.usage_time)
    })



    let screenTime = await getSceenTime()
    screenTime?.map((item: any) => {
      if (!excelObj[item.date]) {
        excelObj[item.date] = JSON.parse(JSON.stringify(labels))
      }
      excelObj[item.date]["screen_time"] = item.usage_time

    })

    console.log("----excelObj-----")
    console.log({ excelObj })
    console.log("----excelObj-----")

    let user:any = await getUser()
    // let k:any = []
    Object.keys(excelObj)?.map((item: any) => {
      let dateData: any = excelObj[item]
      console.log("--------------")
      console.log({ dateData, user, item, excelObj })
      console.log("--------------")
      exelData.push([
        user?.name,
        item, ...[
          dateData.incoming_call_count,
          dateData.outgoing_call_count,
          dateData.missed_call_count,
          dateData.rejected_call_count,
          dateData.incoming_call_duration,
          dateData.outgoing_call_duration,

          dateData["com.whatsapp"],
          dateData["com.whatsapp.w4b"],
          dateData["com.instagram.android"],
          dateData["com.facebook.katana"],
          dateData["com.facebook.orca"],
          dateData["com.snapchat.android"],
          dateData["com.google.android.youtube"],
          dateData["com.zhiliaoapp.musically"],
          dateData["com.tencent.mm"],
          dateData["com.discord"],
          dateData["com.kuaishou.ks"],
          dateData["com.twitter.android"],
          dateData["com.sina.weibo"],
          dateData["com.tencent.mobileqq"],
          dateData["com.spotify.music"],
          dateData["com.google.android.apps.youtube.music"],
          dateData["com.pinterest"],
          dateData["com.netflix.mediaclient"],
          dateData["com.linkedin.android"],
          dateData["xyz.blueskyweb.app"],

          dateData["overall_app_usage"],
          dateData["screen_time"],
        ]
      ])
    })

    console.log("----exelData-----")
    console.log({ exelData })
    console.log("-----exelData----")

    const ws = XLSX.utils.aoa_to_sheet(exelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard");

    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    return wbout;
  };

  const saveFile = async () => {

    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      alert("Storage permission is required to save files.");
      return "";
    }

    let user:any = await getUser()
    const directoryUri = permissions.directoryUri;
    const fileName = `socail-tracker-data-${user.name}-${new Date().toDateString()}.xlsx`


    const wbout = await createExcelData();

    try {
      // Create directory if it doesn’t exist (some Androids don't need this step)
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        directoryUri,
        fileName,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // correct MIME for .xlsx
      );

      // Write the content to the file
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      alert("File saved successfully!");
      return fileUri;

    } catch (error) {
      console.log("Error saving file:", error);
      alert("Failed to save file. Make sure you granted storage permission.");
      return ""
    }


  }


  const saveShareFile = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert("Storage permission is required to save files.");
      return "";
    }


    let user:any = await getUser()
    const fileName = `socail-tracker-data-${user.name}-${new Date().toDateString()}.xlsx`

    // For Android external storage
    const downloadDir = FileSystem.StorageAccessFramework ? FileSystem.documentDirectory : "/storage/emulated/0/SocialTracker";
    const folderPath = `${downloadDir}`;

    const filePath = `${folderPath}/${fileName}`;
    const wbout = await createExcelData();

    try {
      // Create directory if it doesn’t exist (some Androids don't need this step)
      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });

      // Write file
      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return filePath

    } catch (error) {
      console.log("Error saving file:", error);
      alert("Failed to save file. Make sure you granted storage permission.");
      return ""
    }



  }

  const handleDownload = async () => {
    let filePath = await saveFile()
  };

  const handleShare = async () => {
    let filePath: string = await saveShareFile()

    await Sharing.shareAsync(filePath, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Share Excel",
      UTI: "com.microsoft.excel.xlsx",
    });
  };


  const handleUserProfile = ()=>{

    router.navigate("/profile")
  }

  useEffect(() => {


    const update = async ()=>{

    await updateDBData()

    getCallCount().then((result: any) => {
      console.log({ result })
      setCallData(
        [
          { name: "Incoming", population: result[0].incoming_count, color: CALL_OUT_PIE_CHART_COLORS[0] },
          { name: "Outgoing", population: result[0].outgoing_count, color: CALL_OUT_PIE_CHART_COLORS[4] },
          { name: "Missed", population: result[0].missed_count, color: CALL_OUT_PIE_CHART_COLORS[2] },
          { name: "Rejected", population: result[0].rejected_count, color: CALL_OUT_PIE_CHART_COLORS[3] }
        ]
      )
    })


    getCallDuration().then((result: any) => {
      setDurationData([
        { name: "Incoming", population: result[0].incoming_duration, color: CALL_DURATION_PIE_CHART_COLORS[0] },
        { name: "Outgoing", population: result[0].outgoing_duration, color: CALL_DURATION_PIE_CHART_COLORS[1] }
      ]);
    })

    getTotalAppUsage().then((result: any) => {
      let tempUsageData: any = [];
      let appIndex = 0;
      result?.map((app: any, index: number) => {
        if (WHITELIST_APP[app.app_package]) {
          tempUsageData.push({
            name: WHITELIST_APP[app.app_package],
            population: app.usage_time,
            color: APP_USAGE_PIE_CHART_COLORS[appIndex]
          })
          appIndex++
        }
      })
      setUsageData(tempUsageData)

     

    })

    getLastWeekScreenUsage().then((result: any) => {
      let tempDay: string[] = []
      let tempDayData: number[] = [];

      result?.map((app: any) => {
        tempDay.push(app.weekday_name)
        tempDayData.push(app.usage_time)
      })

      setScreenTime({
        labels: tempDay,
        data: tempDayData
      })
    })
  }

  update();
  }, [])




  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="DETECTMiND" />
      </Appbar.Header>
      <ScrollView>
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          paddingHorizontal: 16, 
          marginVertical: 10,
          alignItems: "center",

         }}>
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}
              onPress={handleUserProfile}
            >
             <Button style={{ marginLeft: 5, backgroundColor: "grey", borderRadius: 8, }}>
                <Text style={{ color: "white" }}>User Profile</Text>
              </Button>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}
              onPress={handleDownload}
            >
              <Button style={{ marginLeft: 5, backgroundColor: "black", borderRadius: 8, }}>
                <Text style={{ color: "white" }}>Download</Text>
              </Button>
              {/* <Feather name="download" size={20} color="#000" /> */}

            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={handleShare}
            >
              <Button style={{ marginLeft: 5, backgroundColor: "#1599eb", borderRadius: 8, }}>
                <Text style={{ color: "white" }}>Share</Text>
              </Button>
            </TouchableOpacity>
          </View>
          
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap" }}>
          <View style={{ width: screenWidth / 2 - 20 }}>
            <Text style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}>Call Count</Text>
            <PieChart
              data={callData}
              width={screenWidth / 2 - 20}
              height={200}
              chartConfig={pieChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="50"
              absolute
              hasLegend={false}
            />
            <PieChartCustomLegend data={callData} />
          </View>
          <View style={{ width: screenWidth / 2 - 20 }}>
            <Text style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}>Call Duration</Text>
            <PieChart
              data={durationData}
              width={screenWidth / 2 - 20}
              height={200}
              chartConfig={pieChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="50"
              absolute
              hasLegend={false}
            />
            <PieChartCustomLegend data={durationData} />
          </View>
        </View>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}>App Usage</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      
            {/* Pie Chart */}
            <PieChart
              data={usageData}
              width={(screenWidth / 2) } // Shrink width so legend fits beside
              height={200}
              chartConfig={pieChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="70"
              absolute
              hasLegend={false}
            />

            {/* Custom Legend on Right */}
            <PieChartRightCustomLegend data={usageData} />
          </View>
        </View>
        <View style={{ marginTop: 20, padding: 10, width: screenWidth, alignSelf: "center" }}>
          <Text style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}>Screen Time (Last 7 Days)</Text>
          <BarChart
            data={{
              labels: screenTime.labels,
              datasets: [{ data: screenTime.data }]
            }}
            withInnerLines={false}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=" "
            yAxisSuffix=""
            chartConfig={barChartConfig}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

      </ScrollView>
    </>
  )
}

export default HomeScreen