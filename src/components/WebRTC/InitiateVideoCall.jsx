import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect , useState , useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/Database";
import { AuthContext } from "../Auth/AuthProvider";
import { ThemedButton } from "../StyledButtons/Button";

export default function InitiateVideoCall() {
  const { channelID } = useParams();
  const channelRef = doc(db, `channels/${channelID}`);
  const [isCallIntiated, setCallInitiated] = useState(false);
  const [isOfferCreated, setOfferCreated] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(channelRef, (docSnapshot) => {
      const offer = docSnapshot.get("conferenceCall.offer");
      const isActive = docSnapshot.get("conferenceCall.isActive");
      setOfferCreated(offer !== null);
      setCallInitiated(isActive);
    })
    return unsub;
  }, [channelRef]);

  const currentUser = useContext(AuthContext);
  const navigate = useNavigate();

  const handelInitiateVideoCall = async () => {
    await updateDoc(channelRef, {
      "conferenceCall.offererId": currentUser.uid,
      "conferenceCall.isActive": true,
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
          onClick={handelJoinVideoCall}>
          Join <i className="fa-solid fa-plus" />
        </ThemedButton>
      ) : (
        <ThemedButton
          disabled={isCallIntiated}
          style={{ borderRadius: "5px", marginLeft: "0.5rem" }}
          onClick={handelInitiateVideoCall}>
          <i className="fa-solid fa-video" />
        </ThemedButton>
      )}
    </div>
  );
}
