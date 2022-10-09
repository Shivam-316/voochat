import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./components/Auth/AuthProvider";
import { GoogleSignIn } from "./components/Login/GoogleSignIn";
import { UserChannels } from "./components/ChannelsList/UserChannels";
import { CreateChannel } from "./components/CreateNewChannel/CreateChannel";
import { UserChannel } from "./components/Channel/UserChannel";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import "./index.css";

// store state changes causes whole application to re-render, its the one used by useSelector
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="signIn" element={<GoogleSignIn />} />
            <Route
              path="channels"
              element={
                <AuthProvider>
                  <UserChannels />
                </AuthProvider>
              }
            />
            <Route
              path="channel/new"
              element={
                <AuthProvider>
                  <CreateChannel />
                </AuthProvider>
              }
            />
            <Route
              path="channel/:channelID"
              element={
                <AuthProvider>
                  <UserChannel />
                </AuthProvider>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
