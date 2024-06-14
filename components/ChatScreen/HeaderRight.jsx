// HeaderRight.js
import React from 'react';
import { View, TouchableOpacity, Modal, Text } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import styles from './ChatScreenStyles'; // Make sure to import your styles
import tw from 'tailwind-react-native-classnames';

const HeaderRight = ({
  isAdmin,
  toggleDropdown,
  isDropdownVisible,
  setIsDropdownVisible,
  deleteGroup,
  navigation,
  selectedMessageId,
  deleteMessage,
  route,
}) => {
  return (
    <>
      { selectedMessageId ? (
        <TouchableOpacity onPress={() => deleteMessage(selectedMessageId)} style={{ marginRight: 15 }}>
          <FontAwesome name='trash' size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 80, marginRight: 8 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Video', { chatName: route.params.chatName })}>
            <FontAwesome name='video-camera' size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='call' size={24} color="white" />
          </TouchableOpacity>

          {isAdmin && (
            <>
              <TouchableOpacity onPress={toggleDropdown} style={{ marginRight: 15 }}>
                <FontAwesome name='ellipsis-v' size={24} color="white" />
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={isDropdownVisible}
                onRequestClose={() => setIsDropdownVisible(false)}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TouchableOpacity style={[styles.modalButton, tw`bg-red-700`]} onPress={deleteGroup}>
                      <Text style={[styles.modalButtonText, tw``]}>Delete Group</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, tw`bg-black`]} onPress={() => setIsDropdownVisible(false)}>
                      <Text style={[styles.modalButtonText, tw``]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>
          )}
        </View>
      )}
    </>
  );
};

export default HeaderRight;
