package com.anonymous.SocialTracker

import android.app.AppOpsManager;
import android.provider.Settings;
import com.facebook.react.bridge.Promise;
import androidx.annotation.NonNull;
import android.content.Intent
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import java.util.concurrent.TimeUnit
import java.util.*

class MyKotlinModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        // Initialization code
    }

    override fun getName(): String {
        return "MyKotlinModule"
    }

    @ReactMethod
    fun getAppUsageStats(startTime: Double, endTime: Double, promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            
            val usageEvents: UsageEvents = usageStatsManager.queryEvents(startTime.toLong(), endTime.toLong())
            val usageData = WritableNativeArray()
            val appUsageMap = mutableMapOf<String, Long>()
            val lastResumeMap = mutableMapOf<String, Long>()
            val activeBeforeStart = mutableSetOf<String>()

            while (usageEvents.hasNextEvent()) {
                val event = UsageEvents.Event()
                usageEvents.getNextEvent(event)

                when (event.eventType) {
                    UsageEvents.Event.ACTIVITY_RESUMED -> {
                        lastResumeMap[event.packageName] = event.timeStamp
                    }
                    UsageEvents.Event.ACTIVITY_PAUSED -> {
                        val resumeTime = lastResumeMap.remove(event.packageName)
                        if (resumeTime != null) {
                            val foregroundTime = event.timeStamp - resumeTime
                            appUsageMap[event.packageName] = appUsageMap.getOrDefault(event.packageName, 0L) + foregroundTime
                        } else if (!activeBeforeStart.contains(event.packageName)) {
                            // If app was already open before startTime, count time from startTime to first PAUSED event
                            val foregroundTime = event.timeStamp - startTime.toLong()
                            appUsageMap[event.packageName] = appUsageMap.getOrDefault(event.packageName, 0L) + foregroundTime
                            activeBeforeStart.add(event.packageName)
                        }
                    }
                }
            }

            for ((packageName, totalForegroundTime) in appUsageMap) {
                val appInfo = WritableNativeMap()
                appInfo.putString("packageName", packageName)
                appInfo.putDouble("foregroundUsageTime", TimeUnit.MILLISECONDS.toSeconds(totalForegroundTime).toDouble())
                usageData.pushMap(appInfo)
            }

            promise.resolve(usageData)
        } catch (e: Exception) {
            //Log.e("AppUsageModule", "Error fetching app usage data", e)
            promise.reject("ERROR", "Failed to fetch app usage data")
        }


    }

    @ReactMethod
    fun getScreenTimeStats(startTime: Double, endTime: Double, promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            
            val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime.toLong(), endTime.toLong())

            if (stats != null && stats.isNotEmpty()) {
                val sortedStats = stats.sortedByDescending { it.lastTimeUsed }

                var totalScreenTime = 0L
                for (usageStat in sortedStats) {
                    // Accumulate screen time for each app
                    totalScreenTime += usageStat.totalTimeInForeground
                }
                promise.resolve(totalScreenTime)
            }
            promise.resolve(0L)
        } catch (e: Exception) {
            //Log.e("AppUsageModule", "Error fetching app usage data", e)
            promise.reject("ERROR", "Failed to fetch app usage data")
        }

    }


   @ReactMethod
    fun checkPermission(promise: Promise) {
        val context = getReactApplicationContext()
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow("android:get_usage_stats", android.os.Process.myUid(), context.packageName)

        val granted = (mode == AppOpsManager.MODE_ALLOWED)
        promise.resolve(granted)
    }

    @ReactMethod
    fun openUsageSettings() {
        val context = getReactApplicationContext()
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }
}