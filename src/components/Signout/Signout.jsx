import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import { Button } from "../button/Button";

export const Signout = () => {
  // Get auth
  const auth = useContext(AuthContext);
  // Get current user from redux store
  const currentUser = useSelector((state) => state.userData.user);

  const handelSignOut = async () => {
    // signout from firebase => trigger auth change => changes redux store state
    await signOut(auth);
  };

  return (
    <div>
      {currentUser && <Button onClick={handelSignOut}>Sign Out</Button>}
    </div>
  );
};
