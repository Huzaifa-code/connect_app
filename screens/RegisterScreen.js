import { StyleSheet, View ,KeyboardAvoidingView, Image } from 'react-native'
import React, {useState, useLayoutEffect} from 'react'
import {Button, Input , Text} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase';

import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase'; 

// new
import {ref,  uploadBytesResumable, getDownloadURL } from "firebase/storage" // For image upload


const RegisterScreen = ({navigation}) => {

    const [name, setName ] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [imageUrl, setImageUrl ] = useState('');

    const [image, setImage] = useState(null); // State to hold the image URI

    const [avatar, setAvatar] = useState('https://i.ibb.co/fQ0CfgX/avatar.jpg');


    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    // Function to upload image to Firebase Storage
    const uploadImageToStorage = async (image, userId) => {
      try {

        // -------- Image upload to firebase storage bucket and imageURL add to the user data --------------
        if (!image) {
          alert("Please upload an image first!");
        }
          
        const storageRef = ref(storage, `/ProfilePictures/${image.name}`)
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
              const percent = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );

              // update progress
              // setPercent(percent);
              console.log('Upload is ' + percent + '% done'); //! Without this console.log image is not uploading
          },
          (err) => console.log(err),
          () => {
              // download url
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                  console.log(url);
                  setAvatar(url);
              });
          }
        ); 



        //? old code 
      //     const response = await fetch(image);
      //     const blob = await response.blob();

      //     // Create a reference to the Firebase Storage bucket
      //     const storageRef = storage.refFromURL('gs://signal-clone-73a18.appspot.com');

      //     // Upload the blob to Firebase Storage
      //     const uploadTask = storageRef.child(`images/${userId}`).put(blob);

      //     return new Promise((resolve, reject) => {
      //         uploadTask.on(
      //             'state_changed',
      //             null,
      //             (error) => reject(error), // Reject promise if there's an error
      //             () => {
      //                 // Resolve promise with the download URL once upload is complete
      //                 storageRef
      //                     .child(`images/${userId}`)
      //                     .getDownloadURL()
      //                     .then((url) => resolve(url))
      //                     .catch((error) => reject(error));
      //             }
      //         );
      //     });
      } catch (error) {
          throw new Error('Error uploading image to storage: ' + error.message);
      }
    };

    // useLayoutEffect(() => {
    //   navigation.setOptions({
    //     headerBackTitle: "Back to Login",
    //   });   
    // }, [navigation]);  // works on IOS

    const register = async () => { 

      // TODO : upload image to this storage bucket fire: gs://signal-clone-73a18.appspot.com


      // auth.createUserWithEmailAndPassword(email, password)
      // .then(authUser => {
        //   authUser.user.updateProfile({
        //     displayName: name,
        //     photoURL: imageUrl || "https://i.ibb.co/fQkwn3m/user-1.png",
        //   })
        // })
      // }
      // .catch(error => alert(error.message))

      try {
          const authUser = await auth.createUserWithEmailAndPassword(email, password);

          let imageUrl = "https://i.ibb.co/fQkwn3m/user-1.png"; // Default image URL
          if (image) {
              // If image is selected, upload it to Firebase Storage
              // imageUrl = await uploadImageToStorage(image, authUser.user.uid);
              uploadImageToStorage(image, authUser.user.uid); //! is this not null - fix this
          }

          // Update user profile with name and image URL
          await authUser.user.updateProfile({
              displayName: name,
              photoURL: avatar,
          });

          // Navigate to Home or do other necessary actions
      } catch (error) {
          console.error('Error registering user:', error);
          // Handle error
      }

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
        {/* <Input 
            placeholder='Profile Picture URL (Optional)'
            type='text'
            style={styles.inputText}
            inputContainerStyle={{borderBottomWidth:0}}
            value={imageUrl}
            onChangeText={text => setImageUrl(text)}
            onSubmitEditing={register}
        /> */} 


        <Button 
          title="Choose Profile Picture" 
          onPress={pickImage} 
          buttonStyle={styles.imageInput} 
          containerStyle={styles.button}
        />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
     


      </View>

      <Button 
        containerStyle={styles.button}
        buttonStyle={{backgroundColor: '#381fd1', borderRadius: 10}}
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
        width: "200",
        marginTop: 10,
    },
    inputContainer: {
        width: 320 
    },
    inputText: {
        backgroundColor: '#f1f2f8',
        padding: 10,
        borderRadius: 10
    },
    imageInput: {
      backgroundColor: "#000",
      borderRadius: 10,
      padding: 10,
    }
})