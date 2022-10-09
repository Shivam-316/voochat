import React from "react";
import "./searchitem.css";
export const SearchItem = ({ user, addUser }) => {
  const handelOnClick = () => {
    addUser(user);
  };
  return (
    <div className="search__results__item" onClick={handelOnClick}>
      <img src={user.photoURL} alt="User Img" />
      <div>
        <p>{user.displayName}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
};
