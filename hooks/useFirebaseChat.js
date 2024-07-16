import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import * as firebase from 'firebase/compat';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const useFirebaseChat = (chatId, user) => {
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = db.collection('chats').doc(chatId)
      .collection('messages').orderBy('timestamp').onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        })))
      );

    // Check if current user is admin
    db.collection('chats').doc(chatId).get()
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

    return () => {
      unsubscribe();
    };
  }, [chatId, user]);

  const sendMessage = async (input, image, setImage, setModalVisible, setIsLoading) => {
    if (!input) return;
    setIsLoading(true);

    const messageData = {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: user?.name || auth.currentUser.displayName,
      email: user?.email || auth.currentUser.email,
      photoURL: user?.photo || auth.currentUser.photoURL,
    };

    if (image) {
      const imageUrl = await uploadImageAsync(image);
      messageData.imageUrl = imageUrl;
      setImage(null);
      setModalVisible(false);
    }

    db.collection('chats').doc(chatId).collection('messages').add(messageData);
    setIsLoading(false);
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

    await db.collection('chats').doc(chatId).collection('messages').doc(messageId).delete();
    console.log('Message deleted from Firestore');
  };

  const deleteGroup = async () => {
    const batch = db.batch();
    const messagesRef = db.collection('chats').doc(chatId).collection('messages');
    const querySnapshot = await messagesRef.get();
    const deleteImagePromises = [];

    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      if (messageData.imageUrl) {
        const storage = getStorage();
        const imageRef = ref(storage, messageData.imageUrl);
        deleteImagePromises.push(deleteObject(imageRef));
      }
      batch.delete(doc.ref);
    });

    try {
      await Promise.all(deleteImagePromises);
      await batch.commit();
      await db.collection('chats').doc(chatId).delete();
      console.log('Chat group deleted successfully');
    } catch (error) {
      console.error('Error deleting chat group:', error);
    }
  };

  return {
    messages,
    isAdmin,
    sendMessage,
    deleteMessage,
    deleteGroup,
    uploadImageAsync,
  };
};

export default useFirebaseChat;
