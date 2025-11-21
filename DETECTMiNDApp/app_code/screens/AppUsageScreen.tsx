import { WHITELIST_APP } from "@/const/whitlistApp";
import { getAppUsage } from "@/db/init";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, StyleSheet } from "react-native"
import { Appbar, DataTable } from "react-native-paper";





const AppUsageScreen = () => {

  const [apps, setApps] = useState<any>([])

  useEffect(() => {
    getAppUsage().then(result => {

      let tempData: any = {}
      result?.map((item: any) => {

        if (!tempData[item.date]) {
          tempData[item.date] = Object.keys(WHITELIST_APP).reduce((acc: any, curr: any) => {
            acc[curr] = { "app": WHITELIST_APP[curr], usage: 0 }
            return acc;
          }, {})
        }

        console.log("-------111-------")
        console.log(JSON.stringify(tempData))
        console.log("-------111-------")
        
        if (tempData[item.date] && tempData[item.date][item.app_package]) {
          tempData[item.date][item.app_package].usage = item.usage_time
        }

      })
      console.log("--------------")
      console.log(JSON.stringify(tempData))
      console.log("--------------")
      setApps(tempData)
    })
  }, [])



  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="App Usage" />
      </Appbar.Header>
      <ScrollView>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: 120, backgroundColor: "#f0f0f0", zIndex: 1 }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{padding: 10}}>Date</DataTable.Title>
              </DataTable.Header>
              {Object.keys(apps).map((date: string, index: number) =>
                <DataTable.Row key={index} style={styles.dateCell}>
                  <DataTable.Cell>{date}</DataTable.Cell>
                </DataTable.Row>
              )}
            </DataTable>
          </View>
          <ScrollView horizontal>
            <View style={styles.appUsageTable}>
              <DataTable key={"datatable"}>
              <DataTable.Header>
              {Object.keys(apps).length > 0 && Object.keys(WHITELIST_APP).map((app:any, index:number)=>
                <DataTable.Title style={styles.titleCell} key={`title-${index}-${index}`}>
                   <Text style={styles.centeredText}>{WHITELIST_APP[app]}</Text>
                  </DataTable.Title>
              )}
                 </DataTable.Header>
                {
                 Object.keys(apps).length > 0 && Object.keys(apps)?.map((date: any, index: number) => {


                    return (
                      <>
                        <DataTable.Row>
                          {
                            Object.keys(apps[date]).map((appPackage: any, aIndex: number) => {
                              return (<DataTable.Cell key={`cell-${index}-${aIndex}`} style={styles.cell}>
                                <Text style={styles.centeredText}>{apps[date][appPackage].usage}</Text>
                                </DataTable.Cell>)
                            })
                          }
                        </DataTable.Row>
                      </>
                    )
                  })

                }

              </DataTable>
            </View>
          </ScrollView>
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

export default AppUsageScreen