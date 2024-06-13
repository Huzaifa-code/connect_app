import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FullScreenImageModal = ({ isVisible, imageUri, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name='close' size={30} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: imageUri }} style={styles.fullscreenImage} />
      </View>
    </Modal>
  );
};

export default FullScreenImageModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});
