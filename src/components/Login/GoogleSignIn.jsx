import React from "react";
import {
  GoogleAuthProvider,
  useDeviceLanguage,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import Button from "../StyledButtons/Button";
import "./googleSignIn.css";
import Logo from "../../assets/logo.svg";
import { auth, db } from "../../firebase/Database";
import { collection, addDoc } from "firebase/firestore";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const randomColor = () => `hsl(${Math.random() * 360}, 100%, 50%)`;

export const GoogleSignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.userData.user);

  const signInWithGoogle = async () => {
    // Retrieve google auth provider
    const provider = new GoogleAuthProvider();
    // Set language to device lang
    useDeviceLanguage(auth);

    // Start signin process
    try {
      // signout from firebase => trigger auth change => changes redux store state
      const creadentials = await signInWithPopup(auth, provider);
      const isNewUser = getAdditionalUserInfo(creadentials).isNewUser;
      let { uid, email, displayName, photoURL } = creadentials.user;
      let usersRef = collection(db, "users");

      if (isNewUser) {
        await addDoc(usersRef, {
          uid,
          email,
          displayName,
          photoURL,
          userColor: randomColor(),
        });
      }
      navigate(location.state?.next || "/channels", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  if (currentUser) return <Navigate to="/channels" replace={true} />;

  return (
    <div className="flex">
      <div className="jumbotron">
        <div className="jumbotron__heading">
          <img src={Logo} alt="Large Logo" />
          <h1>VooChat</h1>
        </div>

        <p className="tagline">The fastest way to chat, with people around!</p>

        <Button onClick={signInWithGoogle}>
          Sign In With <i className="fa-brands fa-google"></i>
        </Button>
      </div>
    </div>
  );
};
