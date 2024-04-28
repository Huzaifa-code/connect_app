import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native";
import VideoHome from "../components/VideoScreen/VideoHome";
import VideoRoom from "../components/VideoScreen/VideoRoom";

const VideoScreen = () => {
  const [joinRoom, setJoinRoom] = useState(false);

  const navigate = useCallback((screen) => {
    setJoinRoom(screen === "RoomScreen");
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EFF7FF" }}>
      <StatusBar barStyle={"dark-content"} />
      {joinRoom ? <VideoRoom navigate={navigate} /> : <VideoHome navigate={navigate} />}
    </SafeAreaView>
  );
};

export default VideoScreen; 