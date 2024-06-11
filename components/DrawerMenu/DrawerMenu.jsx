import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import tw from 'tailwind-react-native-classnames';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from "../../firebase"




const DrawerMenu = ({ navigation }) => {
    
  const { user } = useUser();


  const signOutUser = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Remove the stored token
      // Additional code to clear other user data if necessary
      
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
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={signOutUser}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
      {/* Add other drawer menu items here */}
    </View>
  );
};

export default DrawerMenu;
