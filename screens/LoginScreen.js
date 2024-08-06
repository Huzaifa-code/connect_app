import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { KeyboardAvoidingView  } from 'react-native';
import { Button , Input, Image} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase'; 
import { useUser } from '../context/UserContext';
import tw from '../lib/tailwind'


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
    const checkUser = async () => {

      const name = await AsyncStorage.getItem('name');
      const email = await AsyncStorage.getItem('email');
      const photoURL = await AsyncStorage.getItem('photoURL');
      const accessToken = await AsyncStorage.getItem('accessToken');
      // const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      // TODO : Add logic for access token verify (JWT) and logout if expire

      if(name && email && photoURL ){

        const u = {
          name : name,
          email: email,
          photoURL: photoURL,
        }

        // console.log("user from async storage : " , u)

        setUser(u);
        navigation.replace('Main');
      }
    };
    checkUser();
  }, []);

  const signIn = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      
      console.log("user credentials : ", userCredential.user);
      const token = await userCredential.user.getIdToken(); // JWT Token
  
      // Reload user data to get the updated email verification status
      await userCredential.user.reload();
  
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        alert("Please verify your email before logging in. A verification email has been sent to you. ");
        return;
      }else {
        // Save user token to AsyncStorage
        await AsyncStorage.setItem('name', userCredential.user.displayName);
        await AsyncStorage.setItem('email', userCredential.user.email);
        await AsyncStorage.setItem('photoURL', userCredential.user.photoURL);
        await AsyncStorage.setItem('accessToken', token);
        // await AsyncStorage.setItem('refreshToken', userCredential.user.stsTokenManager.refreshToken);


        setUser(userCredential.user);
        navigation.replace('Main');
      }
     
    } catch (error) {
      alert(error.message);
    }
  }


  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUser(user.user);
      
      console.log(user, "user");
      await AsyncStorage.setItem('name', userCredential.user.user.name);
      await AsyncStorage.setItem('email', userCredential.user.user.email);
      await AsyncStorage.setItem('photoURL', userCredential.user.user.photo);
      await AsyncStorage.setItem('accessToken', userCredential.user.idToken);

      // await SecureStore.setItemAsync('userToken', user.idToken);
      navigation.replace('Main');


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
    <KeyboardAvoidingView behavior='padding' enabled style={[tw`h-full bg-primary`,styles.container]}>
      <StatusBar style='light' />
      <View style={tw`mx-5 my-11 flex justify-center`}>
        <Text style={[tw`text-2xl font-bold mb-3`, {"color": "#ffff"}]}>Welcome to Connect</Text>
        <Text style={[tw``, {"color": "#ffff"}]}>Connect with friends, family, and colleagues through seamless chat and video calls. </Text>
      </View>
      
      <View style={[tw`h-5/6 px-6`,styles.inputContainer]}>
        <Text style={[tw`mx-5 mb-7 text-3xl`, {"color": "#000", "fontWeight": 900}]} >Login Now</Text>
        <Input 
          placeholder='Email' 
          // autoFocus 
          type='email' 
          style={[tw`px-5 py-3 w-full`,styles.inputText]}
          inputContainerStyle={{borderBottomWidth:0}}
          value={email} 
          onChangeText={text => setEmail(text)} 
        />
        <Input 
          placeholder='Password' 
          secureTextEntry 
          type='password' 
          style={[tw`px-5 py-3 w-full`,styles.inputText]}
          inputContainerStyle={{borderBottomWidth:0}}
          value={password} 
          onChangeText={text => setPassword(text)} 
          onSubmitEditing={signIn}
        />

        <Button 
          containerStyle={styles.button} 
          buttonStyle={{backgroundColor: '#381fd1', borderRadius: 30}}
          onPress={signIn} 
          title='Login' 
        />

      
        <Button 
          containerStyle={styles.button} 
          buttonStyle={{backgroundColor: '#000', borderRadius: 30}}
          onPress={signInGoogle} 
          title='Google' 
        />

      
        <View style={tw`mt-5 w-full`}>
          <Text style={[tw`text-center`, {} ]} >Don't have an account? </Text>
          <Text 
            style={[tw`text-center font-bold text-base text-primary` ]}  
            onPress={ () => navigation.navigate("Register") } 
          >
            Signup
          </Text>
        </View> 
      </View>


    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'between',
    justifyContent: 'center',
  },
  inputContainer: {
    // width: "%", 
    paddingTop: 70,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  button: {
    // width: "80%",
    marginTop: 10,
    marginBottom: 5,
  },
  inputText: {
      backgroundColor: '#EFEFEF',
      // padding: 10,
      borderRadius: 100,
      // width: "80%"
  }
})