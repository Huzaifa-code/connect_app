import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import tw from '../../lib/tailwind'
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from "../../firebase"
import { Avatar } from '@rneui/themed'





const DrawerMenu = ({ navigation }) => {
    
  const { user } = useUser();


  const signOutUser = async () => {
    try {
      await AsyncStorage.removeItem('name'); 
      await AsyncStorage.removeItem('email'); 
      await AsyncStorage.removeItem('photoURL');
      await AsyncStorage.removeItem('accessToken'); 
      await AsyncStorage.removeItem('refreshToken'); 
      
      if(user){
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          navigation.replace('Login');
        } catch (error) {
          console.log(error);
        }
      }

      // Sign out the user from Firebase authentication
      auth.signOut().then(() => {
        navigation.replace('Login');
      });
  
      console.log('User data cleared successfully');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }

  }

  return (
    <View style={[{ flex: 1, padding: 20 }, tw`flex  items-center`]}>
      
      <Avatar 
        rounded
        source={ { uri:  user?.photoURL || user?.photo } }
        // iconStyle={[{ },tw`w-24`]}
        size={65}
      />

      <Text style={[{}, tw` text-lg font-bold my-4`]}>{user?.name || user?.displayName}</Text>

      <TouchableOpacity onPress={signOutUser} style={[{ backgroundColor: "#000" }, tw`px-11 py-3 rounded-lg flex justify-center items-center`]}>
        <Text style={{ fontSize: 18, fontWeight: 'medium', color: 'white' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DrawerMenu;
