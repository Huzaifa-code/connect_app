import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
  CallContent,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';
import { useEffect, useState } from 'react';

const apiKey = 'afyqdvfgjhrh';
const userId = 'huzaifa';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaHV6YWlmYSJ9.Z20biqv39t6y2XNdrIAmbjEZhv7CZlobx55y4aYgfhw';
const callId = 'test123';
// const callId = chatName;
const user = {id : userId };


const VideoRoom = ({chatName}) => {

  

  const client = new StreamVideoClient({ apiKey, user, token });
  
  // To remove space
  const chat = chatName.replace(/\s+/g, '_');
  const call = client.call('default', chat);
  
  call.join({ create: true });



  return (
    // <View>
    //   <Text>VideoRoom</Text>
    // </View>
    <StreamVideo client={client}>
      <StreamCall call={call}>{/* Your UI */}
        <CallContent/>
      </StreamCall>
    </StreamVideo>
  )
}

export default VideoRoom

const styles = StyleSheet.create({})