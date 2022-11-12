import React, { useContext, useEffect, useState } from "react";

import {
  addDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { AuthContext } from "../Auth/AuthProvider";
import { ThemedButton } from "../StyledButtons/Button";
import { useRef, useMemo } from "react";
import { Howl } from "howler";
import PhoneRing from "../../assets/phone-ring.wav";

export default function ActionHandler({
  peerConnection: pc,
  RemoteVideoRef,
  channelRef,
  handelHangUp,
}) {
  const [isCallStarted, setCallStarted] = useState(false);
  const [offererId, setoffererId] = useState(null);
  const unsubFunctionsArray = useRef([]);
  const currentUser = useContext(AuthContext);
  const offerCandidates = collection(channelRef, "offerCandidates");
  const answerCandidates = collection(channelRef, "answerCandidates");

  const phoneRingSound = useMemo(() => {
    return new Howl({
      src: [PhoneRing],
      loop: true,
    });
  }, []);

  useEffect(() => {
    return () => {
      unsubFunctionsArray.current.forEach((unsub) => unsub());
    };
  }, []);

  useEffect(() => {
    async function getOffererId(reference) {
      const channelDoc = await getDoc(reference);
      return channelDoc.get("conferenceCall.offererId");
    }

    getOffererId(channelRef).then((id) => setoffererId(id));
  }, [channelRef]);

  // Helper functions
  async function setupOfferer() {
    console.log("offer start");
    pc.onicecandidate = (event) => {
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    };

    // create offer
    const offerDescription = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await pc.setLocalDescription(offerDescription);

    // create offerObj
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    // store offer
    await updateDoc(channelRef, {
      "conferenceCall.offer": offer,
    });

    // add listner for answer
    const unsubAnswer = onSnapshot(channelRef, (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data.conferenceCall.answer !== null) {
        const answerDescription = new RTCSessionDescription(
          data.conferenceCall.answer,
        );
        phoneRingSound.stop();
        pc.setRemoteDescription(answerDescription);
      }
    });

    // add listner for answerCandidates
    const unsubAnswerICE = onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
    unsubFunctionsArray.current = [unsubAnswer, unsubAnswerICE];
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
      "conferenceCall.answer": answer,
    });

    const unsubOfferICE = onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
    unsubFunctionsArray.current = [unsubOfferICE];
  }

  // Handelers
  const handelAction = async () => {
    console.log("webcam start");

    pc.ontrack = (event) => {
      if (event.track.kind === "video")
        RemoteVideoRef.current.srcObject = new MediaStream([event.track]);
    };

    console.log("start connection");

    // setup Offerer or Answerer

    if (offererId === currentUser.uid) {
      await setupOfferer();
      phoneRingSound.play();
    } else await setupAnswerer();
    setCallStarted(true);
  };

  handelHangUp.current = async () => {
    phoneRingSound.stop();
    const offerDocs = await getDocs(offerCandidates);
    offerDocs.forEach((doc) => deleteDoc(doc.ref));

    const answerDocs = await getDocs(answerCandidates);
    answerDocs.forEach((doc) => deleteDoc(doc.ref));

    await updateDoc(channelRef, {
      "conferenceCall.answer": null,
      "conferenceCall.offer": null,
      "conferenceCall.offererId": null,
      "conferenceCall.isActive": false,
    });
  };

  if (isCallStarted)
    return (
      <div className="action-button">
        <ThemedButton
          onClick={handelHangUp.current}
          style={{
            backgroundColor: "red",
            color: "var(--text-color)",
            borderRadius: "10px",
          }}>
          <i className="fa-solid fa-phone-slash" />
        </ThemedButton>
      </div>
    );
  else
    return (
      <div className="action-button">
        {offererId && (
          <ThemedButton
            onClick={handelAction}
            style={{
              backgroundColor: "green",
              color: "var(--text-color)",
              borderRadius: "10px",
            }}>
            {offererId === currentUser.uid ? (
              <span>
                Ring
                <i
                  className="fa-solid fa-phone"
                  style={{ paddingLeft: "0.5rem" }}
                />
              </span>
            ) : (
              <span>
                Answer
                <i
                  className="fa-solid fa-phone-flip"
                  style={{ paddingLeft: "0.5rem" }}
                />
              </span>
            )}
          </ThemedButton>
        )}
      </div>
    );
}
