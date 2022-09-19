import React, { useContext, useState } from "react";
import {
  GoogleAuthProvider,
  useDeviceLanguage,
  signInWithPopup,
} from "firebase/auth";
import { Button } from "../button/Button";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
export const GoogleSignIn = () => {
  // Get auth
  const auth = useContext(AuthContext)
  // Get current user from redux store
  const currentUser = useSelector((state) => state.userData.user);

  const signInWithGoogle = async () => {
    // Retrieve google auth provider
    const provider = new GoogleAuthProvider();
    // Set language to device lang
    useDeviceLanguage(auth);
    // Start signin process
    try {
      // signout from firebase => trigger auth change => changes redux store state
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {!currentUser && <Button onClick={signInWithGoogle}>Sign In With Google</Button>}
    </div>
  );
};
