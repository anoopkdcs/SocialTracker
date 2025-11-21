
import { Permission, PermissionsAndroid } from "react-native";

interface PermissionOption {
    title?: string
    message?: string
    buttonNeutral?: string
    buttonNegative?: string,
    buttonPositive?: string,

}

//PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
export const requestPermission = async (permission: Permission, {
    title = "Permission Required",
    message = "This app requires access to your call logs",
    buttonNeutral = "Ask Me Later",
    buttonNegative = "Cancel",
    buttonPositive = "OK",
}: PermissionOption = {}) => {
    try {
        const granted = await PermissionsAndroid.request(permission, {
            title: title,
            message: message,
            buttonNeutral: buttonNeutral,
            buttonNegative: buttonNegative,
            buttonPositive: buttonPositive
        }
        );
        console.log({granted})
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        } else {
            false
        }
    } catch (err) {
        console.warn(err);
    }
};


export const OtherRequestPermission = async (permission: string)=>{
    
}
