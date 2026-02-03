import { NativeModules } from "react-native";
import {  insertOrUpdateAppUsage, insertOrUpdateCallLog, insertOrUpdateScreenTime } from "../db/init";
import { getDateinMileSecTillNow } from "./date";

const updateDBData = async ()=>{

    const { MyKotlinModule, CallLogModule } = NativeModules;

    let datesArray = getDateinMileSecTillNow(10)
    datesArray?.map(async (date:any, index: number) => {
      const result = await MyKotlinModule.getAppUsageStats(date.startMileSec, date.endMiliSec)
      result.map(async(item: any) => {
        await insertOrUpdateAppUsage(date.date, item.packageName, item.foregroundUsageTime,)
      })
    })


    datesArray?.map(async (date:any, index:number) => {
      const callLogs = await CallLogModule.getCallLogs(date.startMileSec, date.endMiliSec)
      let dbData: any = {
        "OUTGOING": {
          "COUNT": 0,
          "DURATION": 0,
        },
        "INCOMING": {
          "COUNT": 0,
          "DURATION": 0,
        },
        "MISSED": {
          "COUNT": 0,
          "DURATION": 0,
        },
        "REJECTED": {
          "COUNT": 0,
          "DURATION": 0,
        },
      }
      callLogs?.map((call: any) => {
        if (dbData[call.call_type]) {
          dbData[call.call_type].COUNT = dbData[call.call_type].COUNT + 1
          dbData[call.call_type].DURATION = dbData[call.call_type].DURATION + call.call_duration
        } else {
          console.log({ error: "-------sdfsdfs--------", type: call.type })
        }
      })

   
        
      
      try{
        await insertOrUpdateCallLog(date.date, "OUTGOING", dbData.OUTGOING.COUNT, dbData.OUTGOING.DURATION, index)
        await insertOrUpdateCallLog(date.date, "INCOMING", dbData.INCOMING.COUNT, dbData.INCOMING.DURATION, index)
        await insertOrUpdateCallLog(date.date, "MISSED", dbData.MISSED.COUNT, dbData.MISSED.DURATION, index)
        await insertOrUpdateCallLog(date.date, "REJECTED", dbData.REJECTED.COUNT, dbData.REJECTED.DURATION, index)
      }catch(err){
        console.log({isError: err})
      }
    

    })

    datesArray?.map(async (date:any, index: number) => {
      const result = await MyKotlinModule.getScreenTimeStats(date.startMileSec, date.endMiliSec)
      await insertOrUpdateScreenTime(date.date, result)
    })
}


export default updateDBData