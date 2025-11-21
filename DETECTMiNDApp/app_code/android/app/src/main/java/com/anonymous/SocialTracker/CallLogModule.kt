package com.anonymous.SocialTracker

import android.content.ContentResolver;
import android.database.Cursor;
import android.provider.CallLog;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;



class CallLogModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        // Initialization code
    }

    override fun getName(): String {
        return "CallLogModule"
    }

    @ReactMethod
    fun getCallLogs(startTime: Double, endTime: Double, promise: Promise) {
        try {
            // Get the content resolver to access the call logs
            val contentResolver: ContentResolver = reactApplicationContext.contentResolver
            val cursor: Cursor? = contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                null,
                "${CallLog.Calls.DATE} BETWEEN ? AND ?",
                arrayOf(startTime.toString(), endTime.toString()),
                "${CallLog.Calls.DATE} DESC"
            )

            if (cursor != null && cursor.moveToFirst()) {
                // Set up date formatting
                val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                val dateColumnIndex = cursor.getColumnIndex(CallLog.Calls.DATE)
                val typeColumnIndex = cursor.getColumnIndex(CallLog.Calls.TYPE)
                val durationColumnIndex = cursor.getColumnIndex(CallLog.Calls.DURATION)

                // Prepare result array
                val callLogs = WritableNativeArray()

                do {
                    // Extract call details
                    val callDate = cursor.getLong(dateColumnIndex)
                    val callType = cursor.getInt(typeColumnIndex)
                    val callDuration = cursor.getInt(durationColumnIndex)

                    // Format the call date
                    val formattedDate = sdf.format(Date(callDate))

                    // Determine the call type
                    val callTypeString = when (callType) {
                        CallLog.Calls.INCOMING_TYPE -> "INCOMING"
                        CallLog.Calls.OUTGOING_TYPE -> "OUTGOING"
                        CallLog.Calls.MISSED_TYPE -> "MISSED"
                        CallLog.Calls.REJECTED_TYPE -> "REJECTED"
                        else -> "UNKNOWN"
                    }

                    // Create the call log map
                    val callLog = WritableNativeMap().apply {
                        putString("date", formattedDate)
                        putString("call_type", callTypeString)
                        putInt("call_duration", callDuration)
                    }

                    // Add the log to the array
                    callLogs.pushMap(callLog)

                } while (cursor.moveToNext())

                cursor.close()
                // Resolve the promise with the call logs
                promise.resolve(callLogs)
            } else {
                // If no call logs were found
                promise.reject("ERROR", "No call logs found")
            }
        } catch (e: Exception) {
            // Reject the promise if an error occurs
            promise.reject("ERROR", "Failed to fetch call logs: ${e.message}")
        }
    }



   /*
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
    */
}