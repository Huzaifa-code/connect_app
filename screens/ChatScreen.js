import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, FlatList, Image,TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';
import React, { useLayoutEffect, useState, useRef } from 'react';
import { Avatar } from '@rneui/themed';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as firebase from 'firebase/compat';
import { db, auth } from "../firebase";
import { useUser } from '../context/UserContext';
import tw from '../lib/tailwind'
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import ImagePreviewModal from '../components/ChatScreen/ImagePreviewModal';
import FullScreenImageModal from '../components/ChatScreen/FullScreenImageModal';
import styles from '../components/ChatScreen/ChatScreenStyles'; // Import styles
import HeaderRight from '../components/ChatScreen/HeaderRight';

const ChatScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false); // State for cropping loader
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const flatListRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat',
      headerTitleAlign: 'left',
      headerStyle: { backgroundColor: '#381fd1' },
      headerTitleStyle: { color: 'white' },
      headerTintColor: 'black',
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar rounded source={{ uri: messages[0]?.data.photoURL || "https://i.ibb.co/fHhL1NG/group-Icon.png" }} />
          <Text style={{color: 'white', marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerRight: () => (
        <HeaderRight
          isAdmin={isAdmin}
          toggleDropdown={toggleDropdown}
          isDropdownVisible={isDropdownVisible}
          setIsDropdownVisible={setIsDropdownVisible}
          deleteGroup={deleteGroup}
          navigation={navigation}
          selectedMessageId={selectedMessageId}
          deleteMessage={deleteMessage}
          route={route}
        />
      ),
    });
  }, [navigation, messages,selectedMessageId, isDropdownVisible ]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsCropping(true); // Show cropping loader
      const optimizedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(optimizedImage.uri);
      setIsCropping(false); // Hide cropping loader
      setModalVisible(true);
    }
  };

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const storageRef = ref(getStorage(), `chatImages/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    blob.close();

    return await getDownloadURL(storageRef);
  };

  const deleteGroup = async () => {
    const batch = db.batch();
  
    // Step 1: Delete all messages in the chat and associated images in Firebase Storage
    const messagesRef = db.collection('chats').doc(route.params.id).collection('messages');
    const querySnapshot = await messagesRef.get();
  
    // Array to hold promises for deleting images
    const deleteImagePromises = [];
  
    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
  
      // Delete image from Firebase Storage if exists
      if (messageData.imageUrl) {
        const storage = getStorage();
        const imageRef = ref(storage, messageData.imageUrl);
        const deleteImagePromise = deleteObject(imageRef);
        deleteImagePromises.push(deleteImagePromise);
      }
  
      // Add message deletion to batch
      batch.delete(doc.ref);
    });
  
    // Step 2: Delete all images and messages in batch
    try {
      // Wait for all image deletions to complete
      await Promise.all(deleteImagePromises);
  
      // Commit batch to delete messages
      await batch.commit();
      console.log('Messages and associated images deleted successfully');
    } catch (error) {
      console.error('Error deleting messages and associated images:', error);
    }
  
    // Step 3: Delete the chat group itself
    const chatRef = db.collection('chats').doc(route.params.id);
    try {
      await chatRef.delete();
      console.log('Chat group deleted successfully');
      // Navigate to previous screen or handle as needed
    } catch (error) {
      console.error('Error deleting chat group:', error);
    }
  
    setIsDropdownVisible(false);

    navigation.navigate("Home")
  };
  


  const sendMessage = async () => {
    Keyboard.dismiss();
    
    setIsLoading(true);


    if (image) {
      const imageUrl = await uploadImageAsync(image);
      db.collection('chats').doc(route.params.id).collection('messages').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        imageUrl,
        displayName: user?.name || auth.currentUser.displayName,
        email: user?.email || auth.currentUser.email,
        photoURL: user?.photo || auth.currentUser.photoURL,
      });
      setImage(null); // Clear the image after sending
      setModalVisible(false);
    } else {
      db.collection('chats').doc(route.params.id).collection('messages').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: user?.name || auth.currentUser.displayName,
        email: user?.email || auth.currentUser.email,
        photoURL: user?.photo || auth.currentUser.photoURL,
      });
    }

    setInput('');
    setIsLoading(false);
  };

  const deleteMessage = async (messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) return;

    const { imageUrl } = message.data;
    if (imageUrl) {
      const storage = getStorage();
      const imageRef = ref(storage, imageUrl);

      try {
        await deleteObject(imageRef);
        console.log('Image deleted from Firebase Storage');
      } catch (error) {
        console.error('Error deleting image from Firebase Storage:', error);
      }
    }

    await db.collection('chats').doc(route.params.id).collection('messages').doc(messageId).delete();
    setSelectedMessageId(null);
    console.log('Message deleted from Firestore');
  };


  useLayoutEffect(() => {
    const unsubscribe = db.collection('chats').doc(route.params.id)
      .collection('messages').orderBy('timestamp').onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        })))
      );

      // Check if current user is admin
    db.collection('chats').doc(route.params.id).get()
    .then(doc => {
      if (doc.exists && doc.data().admin === user?.email) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    })
    .catch(error => {
      console.log("Error checking admin:", error);
    });


    // Set selectedMessageId to null on unmount
    return () => {
      setSelectedMessageId(null);
      unsubscribe();
    };
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
    const isSelected = selectedMessageId === item.id;

    return (
      <TouchableOpacity 
        onLongPress={() => isCurrentUser && setSelectedMessageId(item.id)} // Enable long-press to select message
        onPress={() => isSelected && setSelectedMessageId(null)} // Deselect on regular press if selected
        key={item.id} 
        style={[isCurrentUser ? styles.reciever : styles.sender, isSelected && { backgroundColor: '#000' }]}
      >
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
        {item.data.imageUrl && (
          <TouchableOpacity onPress={() => setFullscreenImage(item.data.imageUrl)}>
            <Image source={{ uri: item.data.imageUrl }} style={styles.chatImage} />
          </TouchableOpacity>
        )}
          <Text style={isCurrentUser ? styles.recieverText : styles.senderText}>{item?.data?.message}</Text>
        
        <Text style={isCurrentUser ? styles.Recievertimestamp : styles.Sendertimestamp}>{formatDate(item.data.timestamp)}</Text>
      </TouchableOpacity>
    );
  };


  const handleOutsidePress = () => {
    if (selectedMessageId) {
      setSelectedMessageId(null); // Deselect if a message is selected
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
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
            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
              <Ionicons name='image' size={24} color="#2B68E6" />
            </TouchableOpacity>
            <TextInput
              placeholder='Message'
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
      {/* {isCropping && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2B68E6" />
        </View>
      )} */}
       
      <ImagePreviewModal
        isVisible={modalVisible}
        imageUri={image}
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
        onClose={() => setModalVisible(false)}
      />
      <FullScreenImageModal
        isVisible={!!fullscreenImage}
        imageUri={fullscreenImage}
        onClose={() => setFullscreenImage(null)}
      />
    </View>
    </TouchableWithoutFeedback>

  );
};

export default ChatScreen;
