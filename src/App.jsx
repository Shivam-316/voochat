import "./App.css";
import { Navbar } from "./components/NavBar/Navbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout } from "./features/user/userSlice";
import { auth } from "./firebase/Database";

function App() {
  // Create dispatch function for calling login, logout actions
  const dispatch = useDispatch();

  // Setup side-effect when ever user auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // if user is avaliable then store user data, else set user to NULL
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        dispatch(login(userData));
      } else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="App grid">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
