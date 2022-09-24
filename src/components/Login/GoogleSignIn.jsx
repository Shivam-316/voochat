import React from "react";
import {
  GoogleAuthProvider,
  useDeviceLanguage,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import Button from "../Buttons/Button";
import "./googleSignIn.css";
import Google from "../../assets/google.svg";
import Logo from "../../assets/logo.svg";
import { auth, db } from "../../firebase/Database";
import { collection, addDoc } from "firebase/firestore";

const randomColor = () => `hsl(${Math.random() * 360}, 100%, 50%)`

export const GoogleSignIn = () => {
  const signInWithGoogle = async () => {
    // Retrieve google auth provider
    const provider = new GoogleAuthProvider();
    // Set language to device lang
    useDeviceLanguage(auth);
    // Start signin process
    try {
      // signout from firebase => trigger auth change => changes redux store state
      const creadentials = await signInWithPopup(auth, provider);
      const isNewUser = getAdditionalUserInfo(creadentials).isNewUser
      let uid = creadentials.user.providerData[0].uid
      let usersRef = collection(db, 'users')

      if(isNewUser){
        await addDoc(usersRef, {uid, userColor: randomColor()})
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <div className="jumbotron">
        <div className="jumbotron__heading">
          <img src={Logo} alt="Large Logo" />
          <h1>VooChat</h1>
        </div>

        <p className="tagline">The fastest way to chat, with people around!</p>

        <Button onClick={signInWithGoogle}>
          Sign In With <img className="google-icon" src={Google} />
        </Button>
      </div>
    </div>
  );
};
