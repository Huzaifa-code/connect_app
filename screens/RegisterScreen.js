import { StyleSheet, View ,KeyboardAvoidingView } from 'react-native'
import React, {useState, useLayoutEffect} from 'react'
import {Button, Input , Text} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase';

const RegisterScreen = ({navigation}) => {

    const [name, setName ] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [imageUrl, setImageUrl ] = useState('');

    // useLayoutEffect(() => {
    //   navigation.setOptions({
    //     headerBackTitle: "Back to Login",
    //   });   
    // }, [navigation]);  // works on IOS

    const register = () => { 
      auth.createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL: imageUrl || "https://i.ibb.co/fQkwn3m/user-1.png",
        })
      }).catch(error => alert(error.message))
    }


  return (
    <KeyboardAvoidingView behavior='padding' enabled style={styles.container}>
      <StatusBar style='light' />
      
      
      <Text h3 style={{ marginBottom: 50 }}>Create a signal account</Text>

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
        <Input 
            placeholder='Profile Picture URL (Optional)'
            type='text'
            style={styles.inputText}
            inputContainerStyle={{borderBottomWidth:0}}
            value={imageUrl}
            onChangeText={text => setImageUrl(text)}
            onSubmitEditing={register}
        />
      </View>

      <Button 
        containerStyle={styles.button}
        buttonStyle={{backgroundColor: '#2c68ed', borderRadius: 30}}
        
        onPress={register}
        title='Register'
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
        width: 200,
        marginTop: 10,
    },
    inputContainer: {
        width: 320 
    },
    inputText: {
        backgroundColor: '#f1f2f8',
        padding: 10,
        borderRadius: 10
    }
})