import { WHITELIST_APP } from "@/const/whitlistApp";
import { getAppUsage, getSceenTime } from "@/db/init";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, StyleSheet } from "react-native"
import { Appbar, DataTable } from "react-native-paper";





const ScreenTimeScreen = () => {

  const [screenTime, setScreenTime] = useState<any>([])

  useEffect(() => {
    getSceenTime().then(result => {

      setScreenTime(result)
      
    })
  }, [])



  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Screen Time" />
      </Appbar.Header>
      <ScrollView>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "100%", backgroundColor: "#f0f0f0", zIndex: 1 }}>
            <DataTable key={"datatable"}>
              <DataTable.Header>
                <DataTable.Title style={{padding: 10}}>Date</DataTable.Title>
                <DataTable.Title style={{padding: 10}}>Screen Time (sec)</DataTable.Title>
              </DataTable.Header>
              {screenTime?.map((item: any, index: number)=>{
                return(
                  <DataTable.Row>
                      <DataTable.Cell key={`cell-date-${index}-${index}`} style={styles.cell}>
                        <Text style={styles.centeredText}>{item.date}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell key={`cell-value-${index}-${index}`} style={styles.cell}>
                      <Text style={styles.centeredText}>{item.usage_time}</Text>
                      </DataTable.Cell>
                  </DataTable.Row>
                )
              })}
             
            </DataTable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  appUsageTable: {
    marginLeft: -15,
    marginRight: -14,
  },
  dateCell: {
    height: 50, 
    padding: 10,       
  },
  titleCell: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    borderColor: 'gray',
    borderWidth: 1,
    
    // backgroundColor: "red",
    // margin:1
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',     
    height: 50,       
    width: 150,
    borderWidth: 1,
    borderColor: 'gray',
    borderTopWidth: 0,
    // backgroundColor: "blue",
    // margin:1
   
  },
  centeredText: {
    textAlign: 'center',       // horizontally center text
    alignSelf: 'center',       // ensure it stays centered in its parent
  },
});

export default ScreenTimeScreen