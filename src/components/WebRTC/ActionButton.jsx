import React from "react";
import { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import {
  addDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { ThemedButton } from "../StyledButtons/Button";
import { useNavigate } from "react-router-dom";
export const ActionButton = ({
  peerConnection: pc,
  getDeviceStream,
  LocalVideoRef,
  RemoteVideoRef,
  remoteStream,
  offererId,
  channelRef,
}) => {
  const [isCallStarted, setCallStarted] = useState(false);
  const navigate = useNavigate();
  const currentUser = useContext(AuthContext);
  const offerCandidates = collection(channelRef, "offerCandidates");
  const answerCandidates = collection(channelRef, "answerCandidates");
  // Helper functions
  async function setupOfferer() {
    console.log("offer start");
    pc.onicecandidate = (event) => {
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    };

    //create offer
    const offerDescription = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await pc.setLocalDescription(offerDescription);

    //create offerObj
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    //store offer
    await updateDoc(channelRef, {
      [`conferenceCall.offer`]: offer,
    });

    //add listner for answer
    const unsubAnswer = onSnapshot(channelRef, (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data.conferenceCall.answer !== null) {
        const answerDescription = new RTCSessionDescription(
          data.conferenceCall.answer,
        );
        pc.setRemoteDescription(answerDescription);
      }
    });

    //add listner for answerCandidates
    const unsubAnswerICE = onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
    return [unsubAnswer, unsubAnswerICE];
  }

  async function setupAnswerer() {
    console.log("answer start");
    pc.onicecandidate = (event) => {
      event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
    };

    const channelData = await getDoc(channelRef);
    const offerDescription = channelData.get("conferenceCall.offer");

    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      sdp: answerDescription.sdp,
      type: answerDescription.type,
    };

    await updateDoc(channelRef, {
      [`conferenceCall.answer`]: answer,
    });

    const unsubOfferICE = onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
    return [unsubOfferICE];
  }

  function stopMedia(mediaElement) {
    mediaElement.current.srcObject?.getTracks().forEach((track) => {
      track.stop();
      mediaElement.current.srcObject.removeTrack(track);
    });
    mediaElement.current.srcObject = null;
  }

  // Handelers
  const handelWebcamStart = () => {
    console.log("webcam start");

    getDeviceStream("").then((stream) => {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      LocalVideoRef.current.srcObject = stream;

      pc.ontrack = (event) => {
        console.log(event);
        remoteStream = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        RemoteVideoRef.current.srcObject = remoteStream;
      };

      RemoteVideoRef.current.srcObject = new MediaStream();

      console.log("start connection");

      //setup Offerer or Answerer

      if (offererId === currentUser.uid)
        setupOfferer().then(() => setCallStarted(true));
      else setupAnswerer().then(() => setCallStarted(true));
    });
  };

  const handelHangUp = async () => {
    await updateDoc(channelRef, {
      [`conferenceCall.answer`]: null,
      [`conferenceCall.offer`]: null,
      [`conferenceCall.offererId`]: null,
      ["conferenceCall.isActive"]: false,
    });

    const offerDocs = await getDocs(offerCandidates);
    offerDocs.forEach(async (doc) => await deleteDoc(doc.ref));

    const answerDocs = await getDocs(answerCandidates);
    answerDocs.forEach(async (doc) => await deleteDoc(doc.ref));

    pc.getSenders().forEach((sender) => pc.removeTrack(sender));

    stopMedia(LocalVideoRef);
    stopMedia(RemoteVideoRef);
    pc.close();
    pc = null;

    navigate(-1);
  };

  return (
    <div className="action-button">
      {isCallStarted ? (
        <ThemedButton
          onClick={handelHangUp}
          style={{
            backgroundColor: "red",
            color: "var(--text-color)",
            borderRadius: "10px",
          }}>
          <i className="fa-solid fa-phone-slash"></i>
        </ThemedButton>
      ) : (
        <ThemedButton
          onClick={handelWebcamStart}
          disabled={offererId === null}
          style={{
            backgroundColor: "green",
            color: "var(--text-color)",
            borderRadius: "10px",
          }}>
          {offererId === currentUser.uid ? (
            <span>
              Ring
              <i
                className="fa-solid fa-satellite-dish"
                style={{ paddingLeft: "0.5rem" }}></i>
            </span>
          ) : (
            <span>
              Answer
              <i
                className="fa-solid fa-phone-flip"
                style={{ paddingLeft: "0.5rem" }}></i>
            </span>
          )}
        </ThemedButton>
      )}
    </div>
  );
};
