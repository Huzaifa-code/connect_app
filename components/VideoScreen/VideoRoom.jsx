import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';
import { useEffect, useState } from 'react';

const apiKey = 'c3sdhryjkp58';
const userId = 'user-id';
const token = 'authentication-token';
const callId = 'my-call-id';
const user = id;

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });


const VideoRoom = () => {
  return (
    // <View>
    //   <Text>VideoRoom</Text>
    // </View>
    <StreamVideo client={client}>
      <StreamCall call={call}>{/* Your UI */}</StreamCall>
    </StreamVideo>
  )
}

export default VideoRoom

const styles = StyleSheet.create({})