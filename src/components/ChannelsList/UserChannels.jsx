import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { db } from "../../firebase/Database";
import DefaultButton from "../StyledButtons/Button";
import { ChannelItem } from "../ChannelsListItem/ChannelItem";
import { Link } from "react-router-dom";
import "./userchannels.css";
import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";

function setChannelsData(queryField, setterMethod, currentUser) {
  let channelsRef = collection(db, "channels");
  const userChannelsQuery = query(
    channelsRef,
    where(queryField, "array-contains", currentUser.uid),
  );
  let unsubscribe = onSnapshot(userChannelsQuery, (querySnap) => {
    let data = querySnap.docs.map((channel) => ({
      channelID: channel.id,
      name: channel.get("Name"),
    }));
    setterMethod(data);
  });

  return unsubscribe;
}

export const UserChannels = () => {
  const [userChannels, setUserChannels] = useState([]);
  const [rquestedChannels, setRequestedChannels] = useState([]);
  const currentUser = useContext(AuthContext);

  useEffect(() => {
    if (db && currentUser) {
      return setChannelsData("participants", setUserChannels, currentUser);
    }
  }, [db, currentUser]);

  useEffect(() => {
    if (db && currentUser) {
      return setChannelsData("requestedUsers", setRequestedChannels, currentUser);
    }
  }, [db, currentUser]);

  return (
    <div className="channels">
      <div className="channels__container">
        <div className="channel__heading">
          <h2>Your Channels</h2>
          <Link to="/channel/new">
            <DefaultButton
              style={{ padding: "0.2rem 0.4rem", marginLeft: "0.5rem" }}>
              <i className="fa-sharp fa-solid fa-plus"></i>
            </DefaultButton>
          </Link>
        </div>
        <hr />
        <ul className="channels__list">
          {userChannels.map((channel) => (
            <ChannelItem
              key={channel.channelID}
              {...channel}
              isRequested={false}
            />
          ))}
        </ul>
      </div>

      <div className="channels__container">
        <h2>Requested Join</h2>
        <hr />
        <ul className="channels__list">
          {rquestedChannels.map((channel) => (
            <ChannelItem
              key={channel.channelID}
              {...channel}
              isRequested={true}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
