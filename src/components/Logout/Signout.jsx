import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/Database";
import Button from "../StyledButtons/Button";

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
