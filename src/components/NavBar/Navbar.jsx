import React, { useState } from "react";
import { Signout } from "../Signout/Signout";
import "./navbar.css";
import Logo from "../../assets/logo.svg";
import { useSelector } from "react-redux";
import Button from "../Button/Button.jsx";
export const Navbar = () => {
  const currentUser = useSelector((state) => state.userData.user);
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkTheme((isdarkTheme) => !isdarkTheme);
  };
  return (
    <div className="nav">
      <div className="nav__logo-container">
        <img src={Logo} alt="Logo" className="nav__logo" />
      </div>
      <div className="nav__buttons">
        {currentUser && <Signout />}
        <Button onClick={toggleTheme}>
          {darkTheme ? (
            <i className="fa-sharp fa-solid fa-moon" />
          ) : (
            <i className="fa-sharp fa-solid fa-sun" />
          )} <span style={{fontSize: "0.5rem"}}>beta</span>
        </Button>
      </div>
    </div>
  );
};
