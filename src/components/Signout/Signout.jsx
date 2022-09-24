import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/App";
import Button from "../Button/Button";

export const Signout = () => {
  const handelSignOut = async () => {
    // signout from firebase => trigger auth change => changes redux store state
    await signOut(auth);
  };

  return (
    <div>
      <Button onClick={handelSignOut}>Sign Out</Button>
    </div>
  );
};
