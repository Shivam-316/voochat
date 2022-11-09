import {
  addDoc,
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import React from "react";
import { useContext } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/Database";
import { AuthContext } from "../Auth/AuthProvider";
import DefaultButton from "../StyledButtons/Button";
import { SearchItem } from "../SearchResultsItem/SearchItem";

import "./createchannel.css";
export const CreateChannel = () => {
  const usersRef = collection(db, "users");
  const [channelName, setChannelName] = useState("");
  const [users, setUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const searchRef = useRef();
  const currentUser = useContext(AuthContext);
  const navigate = useNavigate();

  const handelSearch = (e) => {
    let named = e.target.value;
    async function getSearhResults(nameKey) {
      const uppercaseResults = await getDocs(
        query(
          usersRef,
          orderBy("displayName"),
          startAt(nameKey.toUpperCase()),
          endAt(nameKey.toUpperCase() + "\uf8ff"),
        ),
      );

      const lowercaseResuts = await getDocs(
        query(
          usersRef,
          orderBy("displayName"),
          startAt(nameKey.toLowerCase()),
          endAt(nameKey.toLowerCase() + "\uf8ff"),
        ),
      );

      let results = [...uppercaseResults.docs, ...lowercaseResuts.docs];
      results = results.map((doc) => doc.data());
      return results.filter((user) => user.uid !== currentUser.uid);
    }
    if (named) {
      getSearhResults(named)
      .then(data => setUsers(data))
    }
    else setUsers([]);
  };

  const handelAddUser = (user) => {
    if (!addedUsers.some((addedUser) => addedUser.uid === user.uid))
      setAddedUsers((state) => [
        ...state,
        { uid: user.uid, displayName: user.displayName },
      ]);
    searchRef.current.value = "";
    searchRef.current.focus();
  };

  const handelChannelCreation = async () => {
    if (channelName !== "" && addedUsers.length > 0) {
      const channelsRef = collection(db, "channels");
      await addDoc(channelsRef, {
        Name: channelName,
        participants: [currentUser.uid],
        requestedUsers: addedUsers.map((user) => user.uid),
        conferenceCall: {
          isActive: false,
          isAvaliable: false,
          offer: null,
          answer: null, 
        }
      });
      navigate("/channels", { replace: true });
    }
  };

  return (
    <div className="newchannel__conatiner">
      <input
        type="text"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="Channel Name Here..."
        autoComplete="off"
      />
      <ul className="new_channel__users__conatiner">
        {addedUsers.map((user) => (
          <li key={user.uid}>{user.displayName}</li>
        ))}
        <input
          ref={searchRef}
          type="search"
          onChange={(e) => handelSearch(e)}
          placeholder="Search User..."
        />
      </ul>
      <div className="serach__results">
        <hr style={{ marginBottom: "1rem" }} />
        <div className="serach__results__list">
          {users.map((user) => (
            <SearchItem key={user.uid} user={user} addUser={handelAddUser} />
          ))}
        </div>
      </div>
      <DefaultButton onClick={handelChannelCreation}>
        Create New Channel
      </DefaultButton>
    </div>
  );
};
