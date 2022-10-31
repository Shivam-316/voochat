import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/Database";
import { AuthContext } from "../Auth/AuthProvider";
import { ThemedButton } from "../StyledButtons/Button";

export const InitiateVideoCall = () => {
  const { channelID } = useParams();
  const channelRef = doc(db, `channels/${channelID}`);
  const [isCallIntiated, setCallInitiated] = useState(false);
  const [isOfferCreated, setOfferCreated] = useState(false);

  useEffect(() => {
    return onSnapshot(channelRef, (docSnapshot) => {
      const offer = docSnapshot.get("conferenceCall.offer");
      const isActive = docSnapshot.get("conferenceCall.isActive");
      setOfferCreated(offer !== null);
      setCallInitiated(isActive);
    });
  }, []);

  const currentUser = useContext(AuthContext);
  const navigate = useNavigate();

  const handelInitiateVideoCall = async () => {
    await updateDoc(channelRef, {
      [`conferenceCall.offererId`]: currentUser.uid,
      ["conferenceCall.isActive"]: true,
    });

    navigate("video");
  };

  const handelJoinVideoCall = () => {
    navigate("video");
  };

  return (
    <div>
      {isOfferCreated ? (
        <ThemedButton
          style={{
            borderRadius: "5px",
            marginLeft: "0.5rem",
            backgroundColor: "green",
            color: "var(--text-color)",
          }}
          onClick={(e) => handelJoinVideoCall()}>
          Join <i className="fa-solid fa-plus"></i>
        </ThemedButton>
      ) : (
        <ThemedButton
          disabled={isCallIntiated}
          style={{ borderRadius: "5px", marginLeft: "0.5rem" }}
          onClick={(e) => handelInitiateVideoCall()}>
          <i className="fa-solid fa-video"></i>
        </ThemedButton>
      )}
    </div>
  );
};
