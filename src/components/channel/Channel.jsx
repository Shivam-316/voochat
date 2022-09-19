import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebase/App";
import {
    addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Message } from "../Message/Message";

export const Channel = ({ user = null }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const sendMessageForm = useRef()

  useEffect(() => {
    if (db) {
      const colRef = collection(db, "messages");
      const q = query(colRef, orderBy("createdAt"), limit(100));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
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

  const handelOnSubmit = (e) => {
    e.preventDefault();
    if(db) {
        const colRef = collection(db, 'messages');
        addDoc(colRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            ...user
        })
        .then((response) => sendMessageForm.current.reset())
    }
  }

  return (
    <>
    <ul>
      {messages.map((message) => (
        <Message key={message.uid} {...message}/>
      ))}
    </ul>
    <form ref={sendMessageForm} onSubmit={handelOnSubmit}>
        <input type="text" name="message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
        <button type="submit">Send</button>
    </form>
    </>
  );
};
