import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleSignIn } from "./components/GoogleSignIn/GoogleSignIn";
import { Channel } from "./components/Channel/Channel";
import { Navbar } from "./components/NavBar/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/App";
import { login, logout } from "./features/user/userSlice";
import Spinner from "./components/Spinner/Spinner";

function App() {
  // Create dispatch function for calling login, logout actions
  const dispatch = useDispatch();

  // Initial loder while firebase connects and gets actual state
  const [initializing, setInitializing] = useState(true);

  // Setup side-effect when ever user auth state changes
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

  // Get current user from redux store
  const currentUser = useSelector((state) => state.userData.user);

  return (
    <>
    { initializing ?
      <div className="loading">
        <Spinner side="5rem"/>
      </div>
      :
      <div className="App grid">
        <Navbar />
        {!currentUser && <GoogleSignIn />}
        {currentUser && <Channel />}
      </div>
    }
    </>
  );
}

export default App;
