import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomListItem from '../components/CustomListItem';
import { auth, db } from "../firebase"
import LottieView from "lottie-react-native";
import tw from 'tailwind-react-native-classnames';
import { useUser } from '../context/UserContext';
import { DrawerActions } from '@react-navigation/native'; // Import DrawerActions correctly



const HomeScreen = ({navigation}) => {

  const { user,setRoomCode } = useUser();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    console.log(auth?.currentUser?.displayName , " ? ===  ")

    const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
      setChats(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })))
      setLoading(false)
    })
    
    return unsubscribe
  }, [])


  useLayoutEffect(() => {

    console.log( user , " :  logged in user");

    navigation.setOptions({
      title: 'Connect',
      headerStyle: { backgroundColor: '#381fd1' },
      headerTitleStyle: { color: 'white' },
      headerTitleAlign: 'center',
      headerTintColor: 'black',
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity style={tw`ml-3`} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu-sharp" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View 
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: 80,
          }}
        >
          <TouchableOpacity style={tw`mr-3`} onPress={() => navigation.navigate("AddChat")} activeOpacity={0.5}>
            <SimpleLineIcons name='pencil' size={24} color="white" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation]);

  const enterChat = (id, chatName, roomCode) => {
    // Nvigate to ChatScreen        

    // chats.data.roomCode => set in context
    setRoomCode(roomCode);

    navigation.navigate('Chat', {
      id, 
      chatName,
    })
  }


  if(loading){
    return (
      <View style={tw`flex justify-center items-center h-full`}>
        <LottieView
          source={require("../assets/loader.json")}
          // style={{width: "50%", height: "100%"}}
          style={{width: 200, height: 200}}
          autoPlay
          loop
        />
      </View>
    )
  }

  return (
    <View>
      <ScrollView style={styles.container}>
        { chats.map( ({id, data: {chatName, roomCode}}) => (
          <CustomListItem key={id} id={id} chatName={chatName} roomCode={roomCode} enterChat={enterChat} /> 
        ))}
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