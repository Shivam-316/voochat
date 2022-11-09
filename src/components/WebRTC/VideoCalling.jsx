/* eslint-disable jsx-a11y/media-has-caption */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/Database";
import { AuthContext } from "../Auth/AuthProvider";
import Avatar from "../../assets/avatar.svg";
import StreamsHandler from "./StreamsHandler";
import ActionHandler from "./ActionHandler";
import "./videocalling.css";
import { useMemo } from "react";

const connectionOptions = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function VideoCalling() {
  const pc = useMemo(() => new RTCPeerConnection(connectionOptions), []);
  const currentUser = useContext(AuthContext);
  const [channelData, setChannelData] = useState(null);

  const closeActiveStreams = useRef(null);
  const LocalVideo = useRef(null);
  const RemoteVideo = useRef(null);
  const audio = useRef(null);

  const navigate = useNavigate();

  const { channelID } = useParams();
  const channelRef = doc(db, `channels/${channelID}`);

  useEffect(() => {
    const unsub = onSnapshot(channelRef, (snapshot) => {
      const { isActive, offer, offererId } = snapshot.get("conferenceCall");
      if (!isActive || (offererId !== currentUser.uid && offer === null)) {
        closeActiveStreams.current();
        navigate(-1);
      }
    });

    if (channelData) {
      const remoteUserId = channelData
        .get("participants")
        .find((participantId) => participantId !== currentUser.uid);

      getDocs(query(collection(db, "users"), where("uid", "==", remoteUserId)))
        .then((remoteUserDataArray) => {
          const remoteUserData = remoteUserDataArray.docs[0];
          RemoteVideo.current.style.backgroundImage = `url(${
            remoteUserData.get("photoURL") || Avatar
          })`;
          LocalVideo.current.style.backgroundImage = `url(${
            currentUser.photoURL || Avatar
          })`;
        })
        .catch((error) => console.log(error));
    } else getDoc(channelRef).then((data) => setChannelData(data));

    return unsub;
  }, [channelData, channelRef, currentUser, navigate]);

  return (
    <div className="conference-calling">
      <div className="streams-container">
        <div className="remotestream-container">
          <StreamsHandler
            peerConnection={pc}
            LocalVideoRef={LocalVideo}
            RemoteVideoRef={RemoteVideo}
            AudioRef={audio}
            closeActiveStreams={closeActiveStreams}
          />

          <video ref={RemoteVideo} id="remoteStream" autoPlay playsInline />

          <div className="localstream-container">
            <video ref={LocalVideo} id="localStream" autoPlay playsInline />
          </div>
          {channelData !== null ? (
            <ActionHandler
              peerConnection={pc}
              offererId={channelData.get("conferenceCall.offererId")}
              RemoteVideoRef={RemoteVideo}
              channelRef={channelRef}
            />
          ) : null}
        </div>
        <audio ref={audio} style={{ display: "none" }}></audio>
      </div>
    </div>
  );
}
