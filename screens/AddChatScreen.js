import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Icon, Image, Input } from "@rneui/themed"
import {db} from '../firebase'
import channelIllust from '../assets/illustrations/channel.png'
import tw from 'tailwind-react-native-classnames';
import axios from 'axios';
import LottieView from "lottie-react-native";


const AddChatScreen = ({navigation}) => {

  const [input, setInput] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  useLayoutEffect(() => (
    navigation.setOptions({
      title: 'Create Channel',
    })
  ), [navigation]);

  // POST to Create Room - 100ms
  // https://connect-backend-g3kl.onrender.com/create-room
  // body : 
  // {
  //   "name": "Test-Room",
  //   "description": "testing "
  // }

  const createChat = async () => {

    setIsCreatingRoom(true);

    const response = await axios.post('https://connect-backend-g3kl.onrender.com/create-room', {
      name: input,
      // description: roomDescription,
    });
    const roomDetails = response.data;

    const roomCodeRes = await axios.post('https://connect-backend-g3kl.onrender.com/create-room-code', {
      room_id: roomDetails.id,
      role: "guest",
    });
    const roomCodeResData = roomCodeRes.data.data;
    // console.log(roomCodeResData, " : Room Code Data")

    await db.collection('chats').add({
      chatName: input,
      roomId: roomDetails.id, // Store the room ID
      roomCode: roomCodeResData[0].code,
      roomDetails, // Optional: Store entire room details
    }).then(() => {
      navigation.goBack()
    }).catch(error => alert(error))
  }

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