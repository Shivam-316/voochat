import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/Database";
import { AuthContext } from "../Auth/AuthProvider";
import Avatar from "../../assets/avatar.svg";
import { SelectDevice } from "./SelectDevice";
import { ActionButton } from "./ActionButton";
import "./videocalling.css";
const connectionOptions = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc = new RTCPeerConnection(connectionOptions);
let remoteStream = null;

export const VideoCalling = () => {
  const [offererId, setOffererId] = useState(null);
  const currentUser = useContext(AuthContext);
  const LocalVideo = useRef();
  const RemoteVideo = useRef();

  const { channelID } = useParams();
  const channelRef = doc(db, `channels/${channelID}`);

  useEffect(() => {
    // set offererId
    getDoc(channelRef).then((channelData) => {
      setOffererId(channelData.get("conferenceCall.offererId"));
    });

    // add posters to video elemets
    getDoc(channelRef).then((docData) => {
      const participantsIds = docData.get("participants");
      const remoteUserId = participantsIds.find(
        (participantId) => participantId !== currentUser.uid,
      );

      getDocs(
        query(collection(db, "users"), where("uid", "==", remoteUserId)),
      ).then((remoteUserDataArray) => {
        const remoteUserData = remoteUserDataArray.docs[0];
        RemoteVideo.current.poster = remoteUserData.get("photoURL") || Avatar;
        LocalVideo.current.poster = currentUser.photoURL || Avatar;
      });
    });
  }, []);

  async function getDeviceStream(deviceId) {
    console.log("stream get");
    let videoConstraints = {};

    if (deviceId === "") {
      videoConstraints.facingMode = "environment";
    } else {
      videoConstraints.deviceId = { exact: deviceId };
    }

    return await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: true,
    });
  }

  return (
    <div className="conference-calling">
      <div className="streams-container">
        <div className="remotestream-container">
          <SelectDevice
            peerConnection={pc}
            mediaSource={LocalVideo}
            getDeviceStream={getDeviceStream}
          />

          <video ref={RemoteVideo} id="remoteStream" autoPlay playsInline />

          <div className="localstream-container">
            <video ref={LocalVideo} id="localStream" autoPlay playsInline />
          </div>

          <ActionButton
            peerConnection={pc}
            offererId={offererId}
            getDeviceStream={getDeviceStream}
            LocalVideoRef={LocalVideo}
            RemoteVideoRef={RemoteVideo}
            channelRef={channelRef}
          />
        </div>
      </div>
    </div>
  );
};
