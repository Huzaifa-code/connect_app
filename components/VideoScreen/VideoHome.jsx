import React, { useEffect } from "react";
import { View, TouchableHighlight, Text, StyleSheet } from "react-native";
import {
  requestCameraPermissionsAsync,
  requestMicrophonePermissionsAsync,
} from "expo-camera";
import { Image } from "@rneui/themed";
import videocall from '../../assets/illustrations/videocall.png'
import tw from 'tailwind-react-native-classnames';
import { PermissionsAndroid, Platform } from 'react-native';



const VideoHome = ({ navigate }) => {

    useEffect(() => {
      const run = async () => {
        if (Platform.OS === 'android') {
          await PermissionsAndroid.requestMultiple([
            'android.permission.POST_NOTIFICATIONS',
            'android.permission.BLUETOOTH_CONNECT',
          ]);
        }
      };
      run();
    }, []);


    // Function to handle "Join Room" button press
    const handleJoinPress = async () => {
      const permissionResults = await Promise.allSettled([
        requestCameraPermissionsAsync(),
        requestMicrophonePermissionsAsync(),
      ]);
  
      const permissionsGranted = permissionResults.every(
        (result) => result.status === "fulfilled",
      );
  
      if (permissionsGranted) {
        navigate("RoomScreen");
      } else {
        console.log("Permission Not Granted!");
      }
    };
  
    return (
      <View 
        // style={{ flexDirection: "column" ,flex: 1, alignItems: "center", justifyContent: "between", }}
        style={tw`flex flex-col items-center justify-center h-full `}
      >

        <Text style={[tw`mx-6 text-sm`, {color: "#939393"}]}>Welcome to our video call feature! You can join a video chat room to connect with friends, family, or colleagues.</Text>

        <Image
          source={videocall}  
          style={tw`w-80 h-80`}
        />

        <Text style={[tw`mx-6 text-sm`, {color: "#939393"}]} >Please ensure that you have granted camera and microphone permissions for the best experience.</Text>

        <TouchableHighlight
          onPress={handleJoinPress}
          style={styles.button}
        >
          <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: 500 }}>Join Room</Text>
        </TouchableHighlight>
      </View>
    );
  };

export default VideoHome;

const styles = StyleSheet.create({
    button : {
    paddingHorizontal: 48,
    paddingVertical: 16,
    backgroundColor: "#381fd1",
    borderRadius: 32,
    marginTop: 36
  }
})