import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Avatar } from '@rneui/themed';
import {AntDesign, SimpleLineIcons } from "@expo/vector-icons"
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomListItem from '../components/CustomListItem';
import { auth, db } from "../firebase"


const HomeScreen = ({navigation}) => {

  const [chats, setChats] = useState([]);

  const signOutUser = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Remove the stored token
      // Additional code to clear other user data if necessary
  
      // Sign out the user from Firebase authentication
      auth.signOut().then(() => {
        navigation.replace('Login');
      });
  
      console.log('User data cleared successfully');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }

    // auth.signOut().then(() => {
    //   navigation.replace('Login')
    // })
  }

  useEffect(() => {
    const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
      setChats(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })))
    ))

    return unsubscribe
  }, [])


  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Signal',
      headerStyle: { backgroundColor: '#fff' },
      headerTitleStyle: { color: 'black' },
      headerTitleAlign: 'center',
      headerTintColor: 'black',
      headerShadowVisible: false,
      headerLeft: () => (
        <View >
          <TouchableOpacity style={styles.logout} onPress={signOutUser} activeOpacity={0.5}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
            <Text style={{marginLeft: 5, fontWeight: 500, color: '#2c68ed'}} >Logout</Text>
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View 
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: 80,
          }}
        >
          {/* <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name='camerao' size={24} color="black" />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.navigate("AddChat")} activeOpacity={0.5}>
            <SimpleLineIcons name='pencil' size={24} color="black" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    
    // Nvigate to ChatScreen
    navigation.navigate('Chat', {
      id, 
      chatName,
    })
  }


  return (
    <View>
      <ScrollView style={styles.container}>
        {chats.map( ({id, data: {chatName}}) => (
          <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} /> 
        ))}
        <CustomListItem />
      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  logout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})