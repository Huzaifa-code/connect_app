import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button , Input, Image} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import logo from '../assets/logo.png'
import { auth } from '../firebase'; 

const LoginScreen = ({navigation}) => {

  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          // If user is already logged in, navigate to Home screen
          navigation.replace('Home');
        }
      } catch (error) {
        // console.error('Error retrieving user token:', error);
      }
    };
    checkLoginStatus();
  }, []);



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        navigation.replace('Home');
      }
    });

    return unsubscribe;
  }, []);

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      // Save user token in AsyncStorage upon successful login
      await AsyncStorage.setItem('userToken', userCredential.user.uid);
      navigation.replace('Home');
    })
    .catch(error => alert(error))
  }

  return (
    <KeyboardAvoidingView behavior='padding' enabled style={styles.container}>
      <StatusBar style='light' />
      <Image 
        source={logo}
        style={{width: 150, height: 150}}
      />
      <View style={styles.inputContainer}>
        <Input 
          placeholder='Email' 
          // autoFocus 
          type='email' 
          style={styles.inputText}
          inputContainerStyle={{borderBottomWidth:0}}
          value={email} 
          onChangeText={text => setEmail(text)} 
        />
        <Input 
          placeholder='Password' 
          secureTextEntry 
          type='password' 
          style={styles.inputText}
          inputContainerStyle={{borderBottomWidth:0}}
          value={password} 
          onChangeText={text => setPassword(text)} 
          onSubmitEditing={signIn}
        />
      </View>

      <Button 
        containerStyle={styles.button} 
        buttonStyle={{backgroundColor: '#2c68ed', borderRadius: 30}}
        onPress={signIn} 
        title='Login' 
      />
      <Button 
        onPress={ () => navigation.navigate("Register") } 
        containerStyle={styles.button} 
        buttonStyle={{borderColor: '#2c68ed', borderRadius: 30}}
        type='outline' 
        title='Register' 
      />
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white'
  },
  inputContainer: {
    width: 300, 
    marginTop: 30,
  },
  button: {
    width: 200,
    marginTop: 10,
    marginBottom: 5
  },
  inputText: {
      backgroundColor: '#f1f2f8',
      padding: 10,
      borderRadius: 10
  }
})