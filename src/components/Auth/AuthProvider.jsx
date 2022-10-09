import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../StyledSpinners/Spinner";

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const { user: currentUser, isLoadingUser } = useSelector(
    (state) => state.userData,
  );
  const location = useLocation();

  if (isLoadingUser)
    return (
      <div className="loading">
        <Spinner side="5rem" />
      </div>
    );

  // MN : state={{ next: location.pathname }}
  if (!currentUser) return <Navigate to="/signIn" replace />;

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};
