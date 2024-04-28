import React from "react";
import { View, Text } from "react-native";

const PeerTrackNode = ({ item, HmsView }) => {
  const { peer, track } = item;

  return (
    <View
      style={{
        height: 300,
        margin: 8,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#A0C3D2",
      }}
    >
      {HmsView && track && track.trackId && !track.isMute() ? (
        <HmsView
          key={track.trackId}
          trackId={track.trackId}
          mirror={peer.isLocal}
          style={{ flex: 1 }}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FD8A8A",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "bold", textTransform: "uppercase" }}>
              {peer.name
                .split(" ")
                .map((item) => item[0])
                .join("")}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default PeerTrackNode;
