import { useRef, useState, useEffect } from "react";
import {
  HMSSDK,
  HMSConfig,
  HMSUpdateListenerActions,
  HMSTrackType,
  HMSTrackSource,
  HMSPeerUpdate,
  HMSTrackUpdate,
} from "@100mslive/react-native-hms";
import { Alert } from "react-native";
import {
  updateNode,
  updateNodeWithPeer,
  removeNodeWithPeerId,
  removeNode,
  createPeerTrackNode,
  getPeerTrackNodeId,
} from "../utils/utils.js";
import { useUser } from "../../../context/UserContext.js";



// const ROOM_CODE = "rlk-lsml-aiy";
// const USERNAME = "Test User";


export const usePeerTrackNodes = ({ navigate }) => {

  const { user, roomCode } = useUser();
  const USERNAME = user?.name;
  const ROOM_CODE = roomCode;



    const hmsInstanceRef = useRef(null); // We will save `hmsInstance` in this ref
    const [loading, setLoading] = useState(true);
    const [peerTrackNodes, setPeerTrackNodes] = useState([]); // Use this state to render Peer Tiles
  
    /**
     * Handles Room leave process
     */
    const handleRoomLeave = async () => {
      try {
        const hmsInstance = hmsInstanceRef.current;
  
        if (!hmsInstance) {
          return Promise.reject("HMSSDK instance is null");
        }
        // Removing all registered listeners
        hmsInstance.removeAllListeners();
  
      
        const leaveResult = await hmsInstance.leave();
        console.log("Leave Success: ", leaveResult);
  
       
        const destroyResult = await hmsInstance.destroy();
        console.log("Destroy Success: ", destroyResult);
  
        // Removing HMSSDK instance
        hmsInstanceRef.current = null;
      } catch (error) {
        console.log("Leave or Destroy Error: ", error);
      }
    };
  
   
    const onJoinSuccess = (data) => {
     
      const { localPeer } = data.room;
  
      // Creating or Updating Local Peer Tile
  
      // `updateNode` function updates "Track and Peer objects" in PeerTrackNodes and returns updated list.
      // if none exist then we are "creating a new PeerTrackNode with the received Track and Peer"
      setPeerTrackNodes((prevPeerTrackNodes) =>
        updateNode({
          nodes: prevPeerTrackNodes,
          peer: localPeer,
          track: localPeer.videoTrack,
          createNew: true,
        }),
      );
  
      // Turning off loading state on successful Room Room join
      setLoading(false);
    };
  
    
    const onPeerListener = ({ peer, type }) => {
      // We will create Tile for the Joined Peer when we receive `HMSUpdateListenerActions.ON_TRACK_UPDATE` event.
      // Note: We are chosing to not create Tiles for Peers which does not have any tracks
      if (type === HMSPeerUpdate.PEER_JOINED) return;
  
      if (type === HMSPeerUpdate.PEER_LEFT) {
        // Remove all Tiles which has peer same as the peer which just left the room.
        // `removeNodeWithPeerId` function removes peerTrackNodes which has given peerID and returns updated list.
        setPeerTrackNodes((prevPeerTrackNodes) =>
          removeNodeWithPeerId(prevPeerTrackNodes, peer.peerID),
        );
        return;
      }
  
      if (peer.isLocal) {
        // Updating the LocalPeer Tile.
        // `updateNodeWithPeer` function updates Peer object in PeerTrackNodes and returns updated list.
        // if none exist then we are "creating a new PeerTrackNode for the updated Peer".
        setPeerTrackNodes((prevPeerTrackNodes) =>
          updateNodeWithPeer({
            nodes: prevPeerTrackNodes,
            peer,
            createNew: true,
          }),
        );
        return;
      }
  
      if (
        type === HMSPeerUpdate.ROLE_CHANGED ||
        type === HMSPeerUpdate.METADATA_CHANGED ||
        type === HMSPeerUpdate.NAME_CHANGED ||
        type === HMSPeerUpdate.NETWORK_QUALITY_UPDATED
      ) {
        // Ignoring these update types because we want to keep this implementation simple.
        return;
      }
    };
  
  
    const onTrackListener = ({ peer, track, type }) => {
      // on TRACK_ADDED update
      // We will update Tile with the track or
      // create new Tile for with the track and peer
      if (
        type === HMSTrackUpdate.TRACK_ADDED &&
        track.type === HMSTrackType.VIDEO
      ) {
        // We will only update or create Tile "with updated track" when track type is Video.
        // Tiles without Video Track are already respresenting Peers with or without Audio.
  
        // Updating the Tiles with Track and Peer.
        // `updateNode` function updates "Track and Peer objects" in PeerTrackNodes and returns updated list.
        // if none exist then we are "creating a new PeerTrackNode with the received Track and Peer".
        setPeerTrackNodes((prevPeerTrackNodes) =>
          updateNode({
            nodes: prevPeerTrackNodes,
            peer,
            track,
            createNew: true,
          }),
        );
  
        return;
      }
  
      // on TRACK_MUTED or TRACK_UNMUTED updates, We will update Tiles (PeerTrackNodes)
      if (
        type === HMSTrackUpdate.TRACK_MUTED ||
        type === HMSTrackUpdate.TRACK_UNMUTED
      ) {
        // We will only update Tile "with updated track" when track type is Video.
        if (track.type === HMSTrackType.VIDEO) {
          // Updating the Tiles with Track and Peer.
          // `updateNode` function updates "Track and Peer objects" in PeerTrackNodes and returns updated list.
          // Note: We are not creating new PeerTrackNode object.
          setPeerTrackNodes((prevPeerTrackNodes) =>
            updateNode({
              nodes: prevPeerTrackNodes,
              peer,
              track,
            }),
          );
        } else {
          // Updating the Tiles with Peer.
          // `updateNodeWithPeer` function updates Peer object in PeerTrackNodes and returns updated list.
          // Note: We are not creating new PeerTrackNode object.
          setPeerTrackNodes((prevPeerTrackNodes) =>
            updateNodeWithPeer({
              nodes: prevPeerTrackNodes,
              peer,
            }),
          );
        }
        return;
      }
  
      if (type === HMSTrackUpdate.TRACK_REMOVED) {
        // If non-regular track, or
        // both regular video and audio tracks are removed
        // Then we will remove Tiles (PeerTrackNodes) with removed track and received peer
        return;
      }
  
     
      if (
        type === HMSTrackUpdate.TRACK_RESTORED ||
        type === HMSTrackUpdate.TRACK_DEGRADED
      ) {
        return;
      }
    };
  
  
    const onErrorListener = (error) => {
      setLoading(false);
  
      console.log(`${error?.code} ${error?.description}`);
    };
  
    // Effect to handle HMSSDK initialization and Listeners Setup
    useEffect(() => {
      const joinRoom = async () => {
        try {
          setLoading(true);
  
  
          const hmsInstance = await HMSSDK.build();
  
          // Saving `hmsInstance` in ref
          hmsInstanceRef.current = hmsInstance;
  
          const token = await hmsInstance.getAuthTokenByRoomCode(ROOM_CODE);
  
  
          hmsInstance.addEventListener(
            HMSUpdateListenerActions.ON_JOIN,
            onJoinSuccess,
          );
  
          hmsInstance.addEventListener(
            HMSUpdateListenerActions.ON_PEER_UPDATE,
            onPeerListener,
          );
  
          hmsInstance.addEventListener(
            HMSUpdateListenerActions.ON_TRACK_UPDATE,
            onTrackListener,
          );
  
          hmsInstance.addEventListener(
            HMSUpdateListenerActions.ON_ERROR,
            onErrorListener,
          );
  
  
          hmsInstance.join(
            new HMSConfig({ authToken: token, username: USERNAME }),
          );
        } catch (error) {
          navigate("HomeScreen");
          console.error(error);
          Alert.alert("Error", "Check your console to see error logs!");
        }
      };
  
      joinRoom();
  
      // When effect unmounts for any reason, We are calling leave function
      return () => {
        handleRoomLeave();
      };
    }, [navigate]);
  
    return {
      loading,
      leaveRoom: handleRoomLeave,
      peerTrackNodes,
      hmsInstanceRef,
    };
  };