import { getAllCallLogs, getCallLogs } from "@/db/init";
import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native"
import { Appbar, DataTable } from "react-native-paper";





const CallLogScreen = () => {
  const [callLogs, setCallLogs] = useState([]);

  useEffect(() => {
    getAllCallLogs().then((result: any) => {
      let tempCallLog: any = []
      result?.map((item: any) => {
        tempCallLog.push({
          date: item.date,
          incoming_count: item.incoming_count,
          incoming_duration: item.incoming_duration,
          outgoing_count: item.outgoing_count,
          outgoing_duration: item.outgoing_duration,
          missed_count: item.missed_count,
          rejected_count: item.reject_count,
        })
      })
      console.log({tempCallLog})
      setCallLogs(tempCallLog)
    }).catch((err) => {
      console.log({ err })
    })
  }, [])





  return (
   
    <>
          <Appbar.Header>
            <Appbar.Content title="Call Logs" />
          </Appbar.Header>
          <ScrollView>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 130, backgroundColor: "#f0f0f0", zIndex: 1 }}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Date</DataTable.Title>
                  </DataTable.Header>
                  {callLogs.map((log: any, index: number) => (
                    <DataTable.Row key={index}>
                      <DataTable.Cell style={styles.dateCell}>
                        {/* <Text style={styles.titleDateCell}> */}
                          {log.date}
                        {/* </Text> */}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </View>
              <ScrollView horizontal>
                <View style={styles.appUsageTable}>
                  <DataTable>
                      <DataTable.Header>
                        <DataTable.Title style={styles.titleCell}>Incoming</DataTable.Title>
                        <DataTable.Title style={styles.titleCell}>Incoming Duration</DataTable.Title>
                        <DataTable.Title style={styles.titleCell}>Outgoing</DataTable.Title>
                        <DataTable.Title style={styles.titleCell}>Outgoing Duration</DataTable.Title>
                        <DataTable.Title style={styles.titleCell}>Missed</DataTable.Title>
                        <DataTable.Title style={styles.titleCell}>Rejected</DataTable.Title>
                      </DataTable.Header>
                      {callLogs.map((log: any, index: number) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell style={styles.cell}>
                              <Text style={styles.centeredText}> {log.incoming_count}</Text>
                            </DataTable.Cell>
                          <DataTable.Cell style={styles.cell}>
                            <Text style={styles.centeredText}>{log.incoming_duration}</Text>
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.cell}>
                            <Text style={styles.centeredText}>{log.outgoing_count}</Text>
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.cell}>
                            <Text style={styles.centeredText}>{log.outgoing_duration}</Text>
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.cell}>
                            <Text style={styles.centeredText}>{log.missed_count}</Text>
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.cell}>
                            <Text style={styles.centeredText}>{log.rejected_count ?? 0}</Text>
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
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
  titleDateCell: {
    // justifyContent: 'center',
    // alignItems: 'center',     
    height: 50,  
    // width: 115, 
    // borderWidth: 1,
    // borderColor: 'gray',
    // borderTopWidth: 0,
    // borderLeftWidth: 0
  },
  dateCell: {
    // justifyContent: 'center',
    // alignItems: 'center',     
    height: 50,
  
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
    borderLeftWidth: 0
    // backgroundColor: "blue",
   
  },
  centeredText: {
    textAlign: 'center',       // horizontally center text
    alignSelf: 'center',       // ensure it stays centered in its parent
  },
});

export default CallLogScreen