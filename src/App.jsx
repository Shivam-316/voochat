import "./App.css";
import React from "react";
import { GoogleSignIn } from "./components/googleSignIn/GoogleSignIn";
import { Signout } from "./components/Signout/Signout";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./features/user/userSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/App";
import { Channel } from "./components/channel/Channel";

// Create a context to store auth obj which is required by firebase
export const AuthContext = React.createContext()
function App() {
  // Get Auth Obj
  const auth = getAuth(app);
  // Initial loder while firebase connects and gets actual state
  const [initializing, setInitializing] = useState(true);
  // Create dispatch function for calling login, logout actions
  const dispatch = useDispatch();

  // Setup side-effect when eveer user auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // if user is avaliable then store user data, else set user to NULL
      if (user) {
        dispatch(login(...user.providerData));
      } else {
        dispatch(logout());
      }

      // End initialization state when we have the actual user/null
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  const user = useSelector((state) => state.userData.user); 

  if (initializing) {
    return <p>Loading...</p>;
  }


  return (
    <div className="App">
      <AuthContext.Provider value={auth}>
        <GoogleSignIn />
        <Signout />
        <Channel user={user}/>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
