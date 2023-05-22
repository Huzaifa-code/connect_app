import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Icon, Input } from "@rneui/themed"
import {db} from '../firebase'

const AddChatScreen = ({navigation}) => {

  const [input, setInput] = useState('');

  useLayoutEffect(() => (
    navigation.setOptions({
      title: 'Add a new Chat',
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
      <Input 
        placeholder='Enter a chat name'
        value={input}
        style={styles.inputText}
        inputContainerStyle={{borderBottomWidth:0}}
        onChangeText={text => setInput(text)}
        onSubmitEditing={createChat}
        leftIcon={
          <Icon name='wechat' type='antdesign' size={24} color='black' />
        }
      />
      <Button 
        title='Create new chat'
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
    height: '100%'
  },
  inputText: {
      backgroundColor: '#f1f2f8',
      padding: 10,
      borderRadius: 10
  }
})