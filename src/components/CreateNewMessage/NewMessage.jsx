import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  addDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState , useContext , useEffect } from "react";
import { db, storage } from "../../firebase/Database";
import { ThemedButton } from "../StyledButtons/Button";
import { CHANGE_MESSAGE_ACTION, RESET_ACTION } from "../Channel/UserChannel";
import { FileUpload } from "../UploadFile/FileUpload";

import { AuthContext } from "../Auth/AuthProvider";
import Spinner from "../StyledSpinners/Spinner";
import "./newmessage.css";
import InitiateVideoCall from "../WebRTC/InitiateVideoCall";


export function NewMessage({
  newMessageState,
  newMessageStateDispatch,
  channelID,
}) {
  const currentUser = useContext(AuthContext);
  const [postingMessage, setPostingMessage] = useState(false);
  const [isVideoCallingAvaliable, setVideoCallingAvaliable] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, `channels/${channelID}`), (snapshot) =>
      setVideoCallingAvaliable(snapshot.get(`conferenceCall.isAvaliable`)),
    );

    return unsub;
  });

  const handelOnSubmit = async (e) => {
    e.preventDefault();
    if (db && (newMessageState.messageText || newMessageState.messageImage)) {
      setPostingMessage(true);
      let imageURL = null;

      if (newMessageState.messageImage) {
        const imageRef = ref(storage, newMessageState.messageImage.name);
        await uploadBytes(imageRef, newMessageState.messageImage).catch(
          (error) => console.log(error),
        );
        const url = await getDownloadURL(imageRef).catch((error) =>
          console.log(error),
        );
        imageURL = url;
      }

      const messagesRef = collection(db, `channels/${channelID}/messages`);
      const usersRef = collection(db, "users");
      const userMetaDataSnap = await getDocs(
        query(usersRef, where("uid", "==", currentUser.uid)),
      );

      const { userColor } = userMetaDataSnap.docs[0].data();
      const { displayName, photoURL } = currentUser;

      await addDoc(messagesRef, {
        displayName,
        photoURL,
        userColor,
        imageURL,
        text: newMessageState.messageText,
        createdAt: serverTimestamp(),
      }).catch((error) => console.log(error));

      newMessageStateDispatch(RESET_ACTION());
      setPostingMessage(false);
    }
  };

  const handelOnTextChange = (e) => {
    const text = e.target.value;
    newMessageStateDispatch(CHANGE_MESSAGE_ACTION({ messageText: text }));
  };

  return (
    <form className="message__form" onSubmit={handelOnSubmit}>
      <FileUpload
        newMessageStateDispatch={newMessageStateDispatch}
        postingMessage={postingMessage}
      />
      <input
        type="text"
        name="message"
        value={newMessageState.messageText}
        onChange={handelOnTextChange}
        placeholder="Type Here..."
      />
      <ThemedButton
        disabled={
          postingMessage ||
          (!newMessageState.messageText && !newMessageState.messageImage)
        }
        type="submit"
        style={{ borderTopRightRadius: "5px", borderBottomRightRadius: "5px" }}>
        {postingMessage ? (
          <Spinner side="1rem" />
        ) : (
          <i className="fa-sharp fa-solid fa-paper-plane" />
        )}
      </ThemedButton>
      {isVideoCallingAvaliable && <InitiateVideoCall />}
    </form>
  );
}
