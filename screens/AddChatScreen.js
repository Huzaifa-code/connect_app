import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Icon, Image, Input } from "@rneui/themed"
import {db} from '../firebase'
import channelIllust from '../assets/illustrations/channel.png'
import tw from 'tailwind-react-native-classnames';
import axios from 'axios';
import LottieView from "lottie-react-native";
import {useUser} from '../context/UserContext'


const AddChatScreen = ({navigation}) => {

  const {user} = useUser()

  const [input, setInput] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  useLayoutEffect(() => (
    navigation.setOptions({
      title: 'Create Channel',
      backgroundColor: '#381fd1',
    })
  ), [navigation]);

  const createChat = async () => {
    setIsCreatingRoom(true); // Show loading or disabling UI elements during operation
    try {
 
      const response = await axios.post('https://connect-backend-sable.vercel.app/create-room', {
        name: input,
      });
      const roomDetails = response.data;
  
      // Create a code for the newly created room
      const roomCodeRes = await axios.post('https://connect-backend-sable.vercel.app/create-room-code', {
        room_id: roomDetails.id,
        role: "guest",
      });
      const roomCodeResData = roomCodeRes.data.data;
  
      // Add the new chat to Firestore
      await db.collection('chats').add({
        chatName: input,
        admin: user?.email,
        roomId: roomDetails.id,
        roomCode: roomCodeResData[0].code,
        roomDetails, // Optional: Store entire room details
      });
  
      // Navigate back after successful chat creation
      navigation.goBack();
  
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status code that is out of range (e.g., 4xx, 5xx)
        console.error("API Error:", error.response.data);
        alert("Error creating chat. Please try again.");
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network Error:", error.request);
        alert("Network error. Please check your internet connection and try again.");
      } else {
        // Other errors (e.g., code bugs, unexpected exceptions)
        console.error("Unexpected Error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Reset UI states or hide loading indicators
      setIsCreatingRoom(false);
    }
  };
  

  // const createChat = async () => {

  //   setIsCreatingRoom(true);

  //   // const response = await axios.post('https://connect-backend-g3kl.onrender.com/create-room', {
  //   const response = await axios.post('http://localhost:5000/create-room', {
  //     name: input,
  //     // description: roomDescription,
  //   });
  //   const roomDetails = response.data;

  //   // const roomCodeRes = await axios.post('https://connect-backend-g3kl.onrender.com/create-room-code', {
  //   const roomCodeRes = await axios.post('http://localhost:5000/create-room-code', {
  //     room_id: roomDetails.id,
  //     role: "guest",
  //   });
  //   const roomCodeResData = roomCodeRes.data.data;
  //   // console.log(roomCodeResData, " : Room Code Data")

  //   await db.collection('chats').add({
  //     chatName: input,
  //     roomId: roomDetails.id, // Store the room ID
  //     roomCode: roomCodeResData[0].code,
  //     roomDetails, // Optional: Store entire room details
  //   }).then(() => {
  //     navigation.goBack()
  //   }).catch(error => alert(error))
  // }

  if(isCreatingRoom){
    return (
      <View style={tw`flex justify-center items-center h-full`}>
        <LottieView
          source={require("../assets/loader.json")}
          // style={{width: "50%", height: "100%"}}
          style={{width: 200, height: 200}}
          autoPlay
          loop
        />
        <Text>Chat Room is Being Created. </Text>
        <Text>Please wait! </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Add illustration here */}
      <Image 
        source={channelIllust}  
        style={tw`w-48 h-64`}
      />
      
      {/* TODO : Add Input for adding channel photo - url */}

      <Input 
        placeholder='Enter Channel name'
        value={input}
        style={styles.inputText}
        inputContainerStyle={{borderBottomWidth:0}}
        onChangeText={text => setInput(text)}
        onSubmitEditing={createChat}
        // leftIcon={
        //   <Icon name='wechat' type='antdesign' size={24} color='black' />
        // }
      />
      <Button 
        title='Create channel'
        buttonStyle={{backgroundColor: '#2c68ed', borderRadius: 30}}
        disabled={!input || isCreatingRoom}
        onPress={createChat}
      />
    </View>
  )
}

export default AddChatScreen

const styles = StyleSheet.create({
  container : {
    backgroundColor: 'white',
    padding: 30,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
      backgroundColor: '#f1f2f8',
      padding: 10,
      borderRadius: 10
  }
})