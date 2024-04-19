import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { KeyboardAvoidingView  } from 'react-native';
import { Button , Input, Image} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import logo from '../assets/logo.png'
import { auth, loginGoogle } from '../firebase'; 
import { SocialIcon, SocialIconProps } from '@rneui/themed';
import { useUser } from '../context/UserContext';


const LoginScreen = ({navigation}) => {

  const { setUser } = useUser(); // context of google logged in user


  const [error, setError] = useState();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 

  // Google login
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "506226393944-q3qo1tddfa8eh03ov2o67ikvm81oasq3.apps.googleusercontent.com",
    });
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          // User UID found in AsyncStorage, but we need to wait for auth state to be resolved
          const unsubscribe = auth.onAuthStateChanged(authUser => {
            if (authUser) {
              // User is authenticated, navigate to Home screen
              navigation.replace('Home');
            }
          });
          // Ensure to unsubscribe from onAuthStateChanged after use
          return unsubscribe;
        }
      } catch (error) {
        // Handle error
        console.error('Error retrieving user token:', error);
      }
    };
    checkLoginStatus();

  }, []);

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      // Save user token in AsyncStorage upon successful login
      // console.log( userCredential.user )
      await AsyncStorage.setItem('userToken', userCredential.user.uid);
      navigation.replace('Home');
    })
    .catch(error => alert(error))
  }


  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUser(user.user);
      
      console.log(user, "user");
      await AsyncStorage.setItem('userToken', user.idToken);
      navigation.replace('Home');


      setError();
    } catch (e) {
      setError(e);
    }
  }

  // const getCurrentUser = async () => {
  //   const currentUser = GoogleSignin.getCurrentUser();
  //   console.log(currentUser, " : current user");
  //   // setState({ currentUser });
  // };

  

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
        buttonStyle={{backgroundColor: '#381fd1', borderRadius: 30}}
        onPress={signIn} 
        title='Login' 
      />
      <Button 
        onPress={ () => navigation.navigate("Register") } 
        containerStyle={styles.button} 
        buttonStyle={{borderColor: '#381fd1', borderRadius: 30}}
        type='outline' 
        title='Register' 
      />
      
      <Button 
        containerStyle={styles.button} 
        buttonStyle={{backgroundColor: '#000', borderRadius: 30}}
        icon={
          <SocialIcon
            iconSize={10}
            type={'google'}
            iconType={'font-awesome'}
          />
        }
        onPress={signInGoogle} 
        title='Google' 
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