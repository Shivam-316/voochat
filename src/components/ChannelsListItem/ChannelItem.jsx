import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/Database";
import { AuthContext } from "../Auth/AuthProvider";
import DefaultButton from "../StyledButtons/Button";
import "./channelItem.css";
import { StyledName } from "./ChannelName.styles";
export const ChannelItem = ({ channelID, name, isRequested }) => {
  const currentUser = useContext(AuthContext);
  const channelRef = doc(db, "channels", channelID);

  const navigate = useNavigate();

  const handelDelete = async () => {
    const queryField = isRequested ? "requestedUsers" : "participants";
    await updateDoc(channelRef, {
      [queryField]: arrayRemove(currentUser.uid),
    });

    const channelData = await getDoc(doc(db, "channels", channelID));
    await updateDoc(channelRef, {
      [`conferenceCall.isAvaliable`]: channelData.get('participants').length == 2,
    });
  };

  const handelRequestAccepted = async () => {
    await updateDoc(channelRef, {
      participants: arrayUnion(currentUser.uid),
    });
    handelDelete();
  };

  const handelOpenChannel = () => {
    // Todo check if participant
    if (!isRequested) navigate(`/channel/${channelID}`);
  };

  return (
    <li className="channel__item">
      <StyledName clickable={!isRequested} onClick={handelOpenChannel}>
        {name}
      </StyledName>
      <div className="channel__item__buttons">
        {isRequested && (
          <DefaultButton onClick={handelRequestAccepted}>
            <i className="fa-sharp fa-solid fa-check"></i>
          </DefaultButton>
        )}
        <DefaultButton onClick={handelDelete}>
          <i className="fa-sharp fa-solid fa-trash"></i>
        </DefaultButton>
      </div>
    </li>
  );
};
