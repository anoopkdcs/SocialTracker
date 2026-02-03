import DatabaseService from "@/util/database";


const db = new DatabaseService()
db.init("app.db")

const DBInit = async () => {

    await db.initializeTable("users", `
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    `)



    await db.initializeTable("call_logs", `
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        type TEXT NOT NULL,
        count TEXT  NOT NULL DEFAULT 0,
        duration INTEGER  NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    `)

    await db.initializeTable("app_usgae", `
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        app_package TEXT NOT NULL,
        usage_time TEXT NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    `)

    await db.initializeTable("screen_time", `
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        screen_time TEXT NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    `)
}



const hasUser = async () => {
    let users = await db.getAll("users");
    return users.length == 0 ? false : true
}

const getUser = async () => {
    let users = await db.getAll("users");
    return users?.[0]
}

const createUser = async (name: string) => {
    console.log({ name })
    try {

        if (await hasUser()) {
            return true
        }

        let l = await db.insert("users", {
            "name": name
        })
        console.log("inserted", l)
        return true
    }
    catch (err) {
        console.log({ err })
        return false
    }


}


const updateUser = async (id: number, name: string) => {
    console.log({ name })
    try {

       

        let l = await db.update("users",
            [{
                column: "id",
                value: id
            }],
            {
                "name": name
            }
        )
        console.log("updated", l)
        return true
    }
    catch (err) {
        console.log({ err })
        return false
    }


}

const insertCall = async (date: string, callType: string, duration: number) => {
    try {
        await db.insert("call_logs", {
            date: date,
            type: callType,
            value: duration
        })
        return true
    }
    catch (err) {
        console.log({ err })
        return false
    }
}


const insertOrUpdateCallLog = async (date: string, callType: string, count: number, duration: number, index: number) => {
    try {

        let dbData = {
            "date": date,
            "type": callType,
            "count": count,
            "duration": duration
        }

        console.log({dbData})

        let callLog: any = await db.getOne("call_logs", {
            where: [{
                "column": "date",
                "value": date,
            }, {
                "column": "type",
                "value": callType,
            }

            ]
        })
        console.log({"check_has_log": callLog, index})
        if (callLog) {
            await db.update("call_logs", [{
                column: "id",
                value: callLog.id
            }], dbData)
        } else {
            await db.insert("call_logs", dbData)
        }
        return true
    } catch (err) {
        console.log({ err })
        return false

    }
}

const insertOrUpdateAppUsage = async (date: string, app: string, usageTime: number) => {
    try {

        let dbData = {
            "date": date,
            "app_package": app,
            "usage_time": usageTime
        }

        let appUsage: any = await db.getOne("app_usgae", {
            where: [
                {
                    "column": "date",
                    "value": date
                },
                {
                    "column": "app_package",
                    "value": app
                }
            ]
        })
        console.log({ appUsage })
        if (appUsage) {
            await db.update("app_usgae", [{
                column: "id",
                value: appUsage.id
            }], dbData)
        } else {
            await db.insert("app_usgae", dbData)
        }
        return true
    } catch (err) {
        console.log({ err })
        return false

    }
}

const insertOrUpdateScreenTime = async (date: string, screenTime: number) => {
    try {

        let dbData = {
            "date": date,
            "screen_time": screenTime
        }

        let hasScreenTime: any = await db.getOne("screen_time", {
            where: [
                {
                    "column": "date",
                    "value": date
                },
            ]
        })
        console.log({ hasScreenTime })
        if (hasScreenTime) {
            await db.update("screen_time", [{
                column: "id",
                value: hasScreenTime.id
            }], dbData)
        } else {
            await db.insert("screen_time", dbData)
        }
        return true
    } catch (err) {
        console.log({ err })
        return false

    }
}


const getAllCallLogs = async () => {
    const sql = `
    SELECT 
        date,
        -- Incoming type count and duration
        SUM(CASE WHEN type = 'INCOMING' THEN count ELSE 0 END) AS incoming_count,
        SUM(CASE WHEN type = 'INCOMING' THEN duration ELSE 0 END) AS incoming_duration,
    
        -- Outgoing type count and duration
        SUM(CASE WHEN type = 'OUTGOING' THEN count ELSE 0 END) AS outgoing_count,
        SUM(CASE WHEN type = 'OUTGOING' THEN duration ELSE 0 END) AS outgoing_duration,
    
        -- Missed type count and duration
        SUM(CASE WHEN type = 'MISSED' THEN count ELSE 0 END) AS missed_count,
        SUM(CASE WHEN type = 'MISSED' THEN duration ELSE 0 END) AS missed_duration,
    
        -- Rejected type count and duration
        SUM(CASE WHEN type = 'REJECTED' THEN count ELSE 0 END) AS reject_count,
        SUM(CASE WHEN type = 'REJECTED' THEN duration ELSE 0 END) AS reject_duration

    FROM 
        call_logs
    GROUP BY 
        date
    ORDER BY 
        date DESC;`
    //await db.getAll("SELECT date, type, COUNT(*), SUM(duration) FROM call_logs GROUP BY date, type")
    //await db.executeQuery("SELECT * FROM call_logs")
    return await db.rawQuery(sql)
}

const getCallLogs = async () => {
    return await db.getAll("call_logs")
}


const getAppUsage = async () => {
    return await db.getAll("app_usgae", {
        orderBy: [
            {
                column: "date",
                direction: "DESC"
            },
            {
                column: "usage_time",
                direction: "DESC"
            },


        ]
    })
}

const getSceenTime = async () => {
    return await db.rawQuery("SELECT date, SUM(usage_time) as usage_time FROM app_usgae GROUP BY date ORDER BY date DESC")
}

const getCallCount = async () => {
    return await db.rawQuery(
        `
        SELECT 
        COALESCE(SUM(CASE WHEN type = 'INCOMING' THEN count ELSE 0 END), 0) AS incoming_count,
        COALESCE(SUM(CASE WHEN type = 'MISSED' THEN count ELSE 0 END), 0) AS missed_count,
        COALESCE(SUM(CASE WHEN type = 'OUTGOING' THEN count ELSE 0 END), 0) AS outgoing_count,
        COALESCE(SUM(CASE WHEN type = 'REJECTED' THEN count ELSE 0 END), 0) AS rejected_count
        FROM call_logs;
        `
    )
}

const getCallDuration = async () => {
    return await db.rawQuery(
        `
        SELECT 
        COALESCE( SUM(CASE WHEN type = 'INCOMING' THEN duration ELSE 0 END), 0) AS incoming_duration,
            COALESCE(CASE WHEN type = 'MISSED' THEN duration ELSE 0 END, 0) AS missed_duration,
            COALESCE(CASE WHEN type = 'OUTGOING' THEN duration ELSE 0 END, 0) AS outgoing_duration,
            COALESCE(CASE WHEN type = 'REJECTED' THEN duration ELSE 0 END, 0) AS rejected_duration
        FROM call_logs;
        `
    )
}

const getTotalAppUsage = async () => {
    return await db.rawQuery(
        `
        SELECT
        app_package,
        SUM(usage_time) as usage_time
        FROM app_usgae
        GROUP BY app_package
        ORDER BY app_package;
        `
    )
}


const getLastWeekScreenUsage = async ()=>{
    return await db.rawQuery(
        `
            SELECT 
            date,
            CASE
                WHEN strftime('%w', date) = '0' THEN 'Sun'
                WHEN strftime('%w', date) = '1' THEN 'Mon'
                WHEN strftime('%w', date) = '2' THEN 'Tue'
                WHEN strftime('%w', date) = '3' THEN 'Wed'
                WHEN strftime('%w', date) = '4' THEN 'Thu'
                WHEN strftime('%w', date) = '5' THEN 'Fri'
                WHEN strftime('%w', date) = '6' THEN 'Sat'
                ELSE 'Invalid'
            END AS weekday_name,
            SUM(usage_time) as usage_time
        FROM app_usgae
        GROUP by date
        ORDER by date DESC
        LIMIT 7;
        `
    )
}






export { 
    DBInit, 
    hasUser, 
    getUser,
    createUser, 
    updateUser,
    insertCall, 
    insertOrUpdateCallLog, 
    insertOrUpdateAppUsage,
    insertOrUpdateScreenTime,
    getCallLogs,
    getAllCallLogs,
    getAppUsage, 
    getSceenTime, 
    getCallCount, 
    getCallDuration,
    getTotalAppUsage,
    getLastWeekScreenUsage
} 