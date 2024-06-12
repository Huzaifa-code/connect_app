import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Avatar } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as firebase from 'firebase/compat';
import { db, auth } from "../firebase";
import { useUser } from '../context/UserContext';
import tw from 'tailwind-react-native-classnames';

const ChatScreen = ({ navigation, route }) => {
  const { user } = useUser(); // Google login user context data
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat',
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar rounded source={{ uri: messages[0]?.data.photoURL || "https://i.ibb.co/fHhL1NG/group-Icon.png" }} />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', justifyContent: "space-between", width: 70, marginRight: 8 }}>
          <TouchableOpacity onPress={() => navigation.replace('Video', { chatName: route.params.chatName })}>
            <FontAwesome name='video-camera' size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='call' size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();
    db.collection('chats').doc(route.params.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: user?.name || auth.currentUser.displayName,
      email: user?.email || auth.currentUser.email,
      photoURL: user?.photo || auth.currentUser.photoURL,
    });
    setInput('');
  };

  useLayoutEffect(() => {
    const unsubscribe = db.collection('chats').doc(route.params.id)
      .collection('messages').orderBy('timestamp').onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        })))
      );

    return unsubscribe;
  }, [route]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.data.email === user?.email || item.data.email === auth.currentUser?.email;

    return (
      <View key={item.id} style={isCurrentUser ? styles.reciever : styles.sender}>
        <Avatar
          rounded
          size={30}
          position="absolute"
          bottom={-15}
          right={-5}
          containerStyle={{ position: "absolute", bottom: -15, right: -5 }}
          source={{ uri: item.data.photoURL }}
        />
        {!isCurrentUser && <Text style={styles.senderName}>{item.data.displayName}</Text>}
        <Text style={isCurrentUser ? styles.recieverText : styles.senderText}>{item.data.message}</Text>
        <Text style={isCurrentUser ? styles.Recievertimestamp : styles.Sendertimestamp}>{formatDate(item.data.timestamp)}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style='light' />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} keyboardVerticalOffset={90}>
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            contentContainerStyle={{ paddingTop: 15 }}
          />
          <View style={styles.footer}>
            <TextInput
              placeholder='Signal Message'
              style={styles.textInput}
              value={input}
              onChangeText={(text) => setInput(text)}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
              <Ionicons name='send' size={24} color="#2B68E6" />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  recieverText: {
    color: "black",
    marginLeft: 10,
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    color: "white",
    marginLeft: 10,
    marginBottom: 3,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    paddingBottom: 3,
    fontSize: 10,
    color: "#b2bec3",
  },
  Recievertimestamp: {
    fontSize: 10,
    color: 'gray',
    marginTop: 5,
    marginLeft: 10,
  },
  Sendertimestamp: {
    fontSize: 10,
    color: "#b2bec3",
    marginTop: 5,
    left: 10,
    paddingRight: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    backgroundColor: '#ECECEC',
    color: 'grey',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    height: 50,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    borderWidth: 1,
  },
});
