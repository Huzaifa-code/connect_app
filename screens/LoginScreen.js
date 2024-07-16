import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { KeyboardAvoidingView  } from 'react-native';
import { Button , Input, Image} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { auth, loginGoogle } from '../firebase'; 
import { SocialIcon, SocialIconProps } from '@rneui/themed';
import { useUser } from '../context/UserContext';
import tw from 'tailwind-react-native-classnames';


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

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const userToken = await AsyncStorage.getItem('userToken');
  //       if (userToken) {
  //         // User UID found in AsyncStorage, but we need to wait for auth state to be resolved
  //         const unsubscribe = auth.onAuthStateChanged(authUser => {
  //           if (authUser) {
  //             // User is authenticated, navigate to Home screen
  //             navigation.replace('Home');
  //           }
  //         });
  //         // Ensure to unsubscribe from onAuthStateChanged after use
  //         return unsubscribe;
  //       }
  //     } catch (error) {
  //       // Handle error
  //       console.log('Error retrieving user token:', error);
  //     }
  //   };
  //   checkLoginStatus();

  // }, []);

  const signIn = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      
      
      console.log("user credentials : ", userCredential.user);
  
      // Reload user data to get the updated email verification status
      await userCredential.user.reload();
  
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        alert("Please verify your email before logging in. A verification email has been sent to you. ");
        return; // Stop further execution
      }else {
        // Save user token to AsyncStorage
        await AsyncStorage.setItem('userToken', userCredential.user.uid);
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
      await AsyncStorage.setItem('userToken', user.idToken);
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
    <KeyboardAvoidingView behavior='padding' enabled style={[tw`h-full`,styles.container]}>
      <StatusBar style='light' />
      {/* <Image 
        source={logo}
        style={{width: 150, height: 150}}
      /> */}

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
          // icon={
          //   <SocialIcon
          //     iconSize={10}
          //     type={'google'}
          //     iconType={'font-awesome'}
          //   />
          // }
          onPress={signInGoogle} 
          title='Google' 
        />

      
        <View style={tw`mt-5 w-full`}>
          <Text style={[tw`text-center`, {} ]} >Don't have an account? </Text>
          <Text 
            style={[tw`text-center font-bold text-base`, {"color": "#381FD1"} ]}  
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
    backgroundColor: '#381FD1',
    // height: "100%",
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