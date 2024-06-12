import { StyleSheet, View ,KeyboardAvoidingView, Image, Alert } from 'react-native'
import React, {useState, useLayoutEffect} from 'react'
import {Button, Input , Text} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import LottieView from "lottie-react-native";
import tw from 'tailwind-react-native-classnames';




const RegisterScreen = ({navigation}) => {

    const [name, setName ] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [image, setImage] = useState(null); // State to hold the image URI
    const [avatar, setAvatar] = useState('https://i.ibb.co/fQ0CfgX/avatar.jpg');
    const [loading, setLoading] = useState(false); // State for loader visibility

    


    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 300 } }], // resize image to a smaller width while maintaining aspect ratio
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // compress image and convert to JPEG
        );
  
        setImage(manipResult.uri);
      }
    };

    const uploadImage = async (authUser) => {
      if (!image) {
        return; // No image to upload
      }

  
      try {

        const response = await fetch(image);
        const blob = await response.blob();

        const storageRef = ref(getStorage(), `ProfilePictures/${authUser.user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused.');
                break;
              case 'running':
                console.log('Upload is in progress...');
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading your profile picture. Please try again.');
            setLoading(false);
          },
          async () => {
            // Get the download URL after successful upload
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL of dp :", downloadURL )
            setAvatar(downloadURL);

            // Update name and profile picture
            await authUser.user.updateProfile({
              displayName: name,
              photoURL: downloadURL,
            });

            setLoading(false);
          }
        );

      } catch (error) {
        console.error('Error uploading image:', error);
        alert('An error occurred while uploading your profile picture. Please try again.');
        setLoading(false);
      }
    };



    
    const register = async () => {

      if (!image) {
        alert('Please select a profile picture to continue.');
        return;
      }

      setLoading(true);

      try {
        const authUser = await auth.createUserWithEmailAndPassword(email, password);
        await authUser.user.sendEmailVerification();
        await uploadImage(authUser);

        Alert.alert(
          "Verification Email Sent",
          "Please check your email for the verification link and verify your email before logging in.",
          [
            {
              text: "OK",
              onPress: () => navigation.replace("Login"),
            },
          ]
        );
      } catch (error) {
        alert(error.message);
      }
    };


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
    <KeyboardAvoidingView behavior='padding' enabled style={styles.container}>
      <StatusBar style='light' />
      
      
      <Text h3 style={{ marginBottom: 50 }}>Create connect account</Text>

      <View style={styles.inputContainer}>
        <Input 
            placeholder='Full Name'
            autoFocus
            type='text'
            style={styles.inputText}
            inputContainerStyle={{borderBottomWidth:0}}
            value={name}
            onChangeText={text => setName(text)}
        />
        <Input 
            placeholder='Email'
            type='emial'
            style={styles.inputText}
            inputContainerStyle={{borderBottomWidth:0}}
            value={email}
            onChangeText={text => setEmail(text)}
        />
        <Input 
            placeholder='Password'
            secureTextEntry
            style={styles.inputText}
            inputContainerStyle={{borderBottomWidth:0}}
            type='password'
            value={password}
            onChangeText={text => setPassword(text)}
        />

        <View style={tw`flex justify-center items-center`}>
          <Button 
            title="Choose Profile Picture" 
            onPress={pickImage} 
            buttonStyle={styles.imageInput} 
            containerStyle={styles.button}
          />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>



      </View>

      <Button 
        // containerStyle={styles.button}
        buttonStyle={[{backgroundColor: '#381fd1', width: 320}, tw`rounded-full my-8 `]}
        titleStyle={[tw`text-center py-1`, { width: 320 }]}
        onPress={register}
        title='Create Account'
      />

    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    padding: 10,
    backgroundColor: 'white',
  },
  button: {   
      // width: 200,
    width: 320,
    marginTop: 10,
  },
  inputContainer: {
    width: 350
  },
  inputText: {
    backgroundColor: '#f1f2f8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  imageInput: {
    backgroundColor: "#000",
    borderRadius: 30,
    padding: 10,
  }
})