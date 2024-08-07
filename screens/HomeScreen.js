import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
import CustomListItem from '../components/CustomListItem';
import { auth, db } from "../firebase"
import LottieView from "lottie-react-native";
import tw from '../lib/tailwind'
import { DrawerActions, useIsFocused } from '@react-navigation/native'; // Import DrawerActions correctly
import axios from 'axios'
import { useDataContext, useUser } from '../context';


const HomeScreen = ({navigation}) => {

  const { user } = useUser();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeout, setTimeoutReached] = useState(false);
  const [error, setError] = useState(null);
  const { dataChanged, setDataChanged } = useDataContext();


  // useEffect(() => {

  //   console.log(auth?.currentUser?.displayName , " ? ===  ")

  //   const fetchData = () => {
  //     const unsubscribe = db.collection('chats').onSnapshot(
  //       snapshot => {
  //         setChats(snapshot.docs.map(doc => ({
  //           id: doc.id,
  //           data: doc.data(),
  //         })));
  //         setLoading(false);
  //         clearTimeout(fetchTimeout); // Clear the timeout if data is fetched successfully
  //       },
  //       error => {
  //         console.error("Error fetching data: ", error);
  //         setLoading(false);
  //         setTimeoutReached(true);
  //       }
  //     );

  //     return unsubscribe;
  //   };

  //   const fetchTimeout = setTimeout(() => {
  //     if (loading) {
  //       setLoading(false);
  //       setTimeoutReached(true);
  //     }
  //   }, 50000); // 5 seconds timeout

  //   const unsubscribe = fetchData();

  //   return () => {
  //     clearTimeout(fetchTimeout); // Clear timeout on unmount
  //     unsubscribe();
  //   };
  // }, [])

  const fetchChats = async () => {
    try {
      setLoading(true);
      // const response = await axios.get('http://192.168.29.56:5000/api/chats');
      const response = await axios.get('https://connect-backend-sable.vercel.app/api/chats');
      setChats(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError(err.message || 'An error occurred while fetching chats');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  },[])

  useEffect(() => {
    if (dataChanged) {
      fetchChats();
      setDataChanged(false); // Reset dataChanged to false
    }
  }, [dataChanged]);


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

  const enterChat = (id, chatName) => {
    // Nvigate to ChatScreen        

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

  if (error) {
    return (
      <View style={tw`flex justify-center items-center h-full`}>
        <Text style={tw`text-lg`}>No internet connection. Please try again.</Text>
        <TouchableOpacity
          style={tw`mt-4 bg-blue-500 px-4 py-2 rounded`}
          onPress={() => {
            setLoading(true);
            setTimeoutReached(false);
            fetchChats(); // Retry fetching data
          }}
        >
          <Text style={tw`text-white`}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <ScrollView style={styles.container}>
        { chats.map( ({id, data: {chatName}}) => (
          <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} /> 
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