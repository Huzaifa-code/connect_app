import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ImagePreviewModal = ({ isVisible, imageUri, input, setInput, onSend, onClose, isLoading }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#2B68E6" />
          ) : (
            <>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TextInput
                placeholder='Add a message'
                style={styles.textInput}
                value={input}
                onChangeText={setInput}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                  <Ionicons name='send' size={24} color="white" />
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ImagePreviewModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: '#2B68E6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
  },
});
