import React, { useEffect, useReducer, useRef, useState } from "react";
import { db } from "../../firebase/Database";
import { Message } from "../MessageItem/Message";
import { NewMessage } from "../CreateNewMessage/NewMessage";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import "./channel.css";
import { ImageUploadPreview } from "../UploadPreview/ImageUploadPreview";
import { useNavigate, useParams } from "react-router-dom";
import { ThemedButton } from "../StyledButtons/Button";

const initialNewMessageState = {
  preview: false,
  previewImageURL: "",
  messageImage: null,
  messageText: "",
};

export const ADD_IMAGE_ACTION = (payload) => {
  return {
    type: "addImage",
    payload,
  };
};
export const REMOVE_IMAGE_ACTION = () => {
  return {
    type: "removeImage",
  };
};
export const CHANGE_MESSAGE_ACTION = (payload) => {
  return {
    type: "changeMessage",
    payload,
  };
};
export const RESET_ACTION = () => {
  return {
    type: "reset",
  };
};

function newMessageReducer(state, action) {
  switch (action.type) {
    case "addImage":
      return {
        ...state,
        previewImageURL: action.payload.previewImageURL,
        messageImage: action.payload.messageImage,
        preview: true,
      };
    case "removeImage":
      return {
        ...state,
        previewImageURL: initialNewMessageState.previewImageURL,
        messageImage: initialNewMessageState.messageImage,
        preview: initialNewMessageState.preview,
      };
    case "changeMessage":
      return {
        ...state,
        messageText: action.payload.messageText,
      };
    case "reset":
      return initialNewMessageState;
    default:
      throw new Error("No such action for new message object!");
  }
}

export const UserChannel = () => {
  const [messages, setMessages] = useState([]);
  const messagesListEnd = useRef();
  const navigate = useNavigate();
  const [newMessageState, newMessageStateDispatch] = useReducer(
    newMessageReducer,
    initialNewMessageState,
  );

  const scrollToBottom = () => {
    messagesListEnd.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const { channelID } = useParams();

  useEffect(() => {
    if (db) {
      const colRef = collection(db, `channels/${channelID}/messages`);
      const messageQuery = query(colRef, orderBy("createdAt"), limit(100));
      const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
        // Get all documents from collection - with ID's
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // Update state
        setMessages(data);
      });

      return unsubscribe;
    }
  }, [db]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  useReducer();
  return (
    <div className="messages__container">
      <div className="goto__channels">
        <ThemedButton onClick={() => navigate("/channels")}>
          <i className="fa-sharp fa-solid fa-list-ul"></i>
        </ThemedButton>
      </div>

      <ImageUploadPreview
        newMessageState={newMessageState}
        newMessageStateDispatch={newMessageStateDispatch}
      />

      <ul>
        <div className="channel__boilerplate">
          <h1>
            Wecome To
            <br />
            Voochat
          </h1>
          <p>This is the beggining of chat</p>
        </div>

        <hr />

        <div className="messages">
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
        </div>

        <div ref={messagesListEnd} className="messages__end"></div>
      </ul>

      <NewMessage
        newMessageState={newMessageState}
        newMessageStateDispatch={newMessageStateDispatch}
        channelID={channelID}
      />
    </div>
  );
};
