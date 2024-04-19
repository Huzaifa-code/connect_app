import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Icon, Image, Input } from "@rneui/themed"
import {db} from '../firebase'
import channelIllust from '../assets/illustrations/channel.png'
import tw from 'tailwind-react-native-classnames';

const AddChatScreen = ({navigation}) => {

  const [input, setInput] = useState('');

  useLayoutEffect(() => (
    navigation.setOptions({
      title: 'Create Channel',
    })
  ), [navigation]);


  const createChat = async () => {
    await db.collection('chats').add({
      chatName: input
    }).then(() => {
      navigation.goBack()
    }).catch(error => alert(error))
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
        disabled={!input}
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