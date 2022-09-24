import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useSelector } from "react-redux";
import { db, storage } from "../../../firebase/App";
import { ThemedButton } from "../Button/Button";
import { CHANGE_MESSAGE_ACTION, RESET_ACTION } from "../Channel/Channel";
import { FileUpload } from "../FileUpload/FileUpload";
import Spinner from "../Spinner/Spinner";
import "./newmessage.css";

export const NewMessage = ({ newMessageState, newMessageStateDispatch }) => {
  const currentUser = useSelector((state) => state.userData.user);
  const [postingMessage, setPostingMessage] = useState(false);

  const handelOnSubmit = async (e) => {
    e.preventDefault();
    if (db && (newMessageState.messageText || newMessageState.messageImage)) {
      setPostingMessage(true);
      let imageURL = null;

      if (newMessageState.messageImage) {
        let imageRef = ref(storage, newMessageState.messageImage.name);
        await uploadBytes(imageRef, newMessageState.messageImage).catch(
          (error) => console.log(error),
        );
        let url = await getDownloadURL(imageRef).catch((error) =>
          console.log(error),
        );
        imageURL = url;
      }

      const colRef = collection(db, "messages");
      const usersRef = collection(db, 'users');

      let userMetaDataSnap = await getDocs(query(usersRef, where('uid', '==', currentUser.uid)))
      let userMetaData = userMetaDataSnap.docs[0].data()

      await addDoc(colRef, {
        text: newMessageState.messageText,
        imageURL,
        createdAt: serverTimestamp(),
        userColor: userMetaData.userColor,
        ...currentUser,
      });

      newMessageStateDispatch(RESET_ACTION());
      setPostingMessage(false);
    }
  };

  const handelOnTextChange = (e) => {
    let text = e.target.value;
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
        {postingMessage ? <Spinner side={"1rem"}/> : <i className="fa-sharp fa-solid fa-paper-plane"></i>}
      </ThemedButton>
    </form>
  );
};
