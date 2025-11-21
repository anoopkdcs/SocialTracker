
export const  getDateinMileSecTillNow = (daysBefore: number, useUTC: boolean = false) => {

    if (daysBefore < 1) throw new Error("Days must be at least 1");

    const result:any = [];
  
    // for (let i = 0; i < daysBefore; i++) {
    //   const baseDate = new Date();
    //   baseDate.setDate(baseDate.getDate() - i);
  
    //   const start = new Date(baseDate);
    //   const end = new Date(baseDate);
  
    //   if (useUTC) {
    //     start.setUTCHours(0, 0, 0, 0);
    //     end.setUTCHours(23, 59, 59, 999);
    //   } else {
    //     start.setHours(0, 0, 0, 0);
    //     end.setHours(23, 59, 59, 999);
    //   }
  
    //   const dateString = useUTC
    //     ? start.toISOString().split("T")[0]
    //     : start.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
  
    //   result.push({
    //     timezone: useUTC ? "UTC" : Intl.DateTimeFormat().resolvedOptions().timeZone,
    //     startMileSec: start.getTime(),
    //     endMiliSec: end.getTime(),
    //   });
    // }
  
    // return result;

    let today = new Date();
    for(let i = 0; i < daysBefore; i ++){
      let startDate = new Date(today);
      startDate.setDate(today.getDate() - i);
      startDate.setHours(0, 0, 0, 0);
     


      let endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);
     

      if (useUTC) {
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(0, 0, 0, 0);
      } else {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
      }

      const endMilliseconds = endDate.getTime();
      const startMilliseconds = startDate.getTime();

         const dateString = useUTC
        ? startDate.toISOString().split("T")[0]
        : startDate.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

      result.push({
        date: dateString,
        timezone: useUTC ? "UTC" : Intl.DateTimeFormat().resolvedOptions().timeZone,
        startMileSec: startMilliseconds,
        endMiliSec: endMilliseconds,
      });
    }

   return result;

  }