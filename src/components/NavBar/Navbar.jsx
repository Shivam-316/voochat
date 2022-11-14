// import React, { useState } from "react";
import { Signout } from "../Logout/Signout";
import Logo from "../../assets/logo.svg";
// import Button from "../StyledButtons/Button.jsx";
import "./navbar.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export const Navbar = () => {
  const currentUser = useSelector((state) => state.userData.user);
  // const [darkTheme, setDarkTheme] = useState(true);

  // const toggleTheme = () => {
  //   document.documentElement.classList.toggle("dark");
  //   setDarkTheme((isdarkTheme) => !isdarkTheme);
  // };
  return (
    <div className="nav">
      <Link to="/">
        <div className="nav__logo-container">
          <img src={Logo} alt="Logo" className="nav__logo" />
        </div>
      </Link>
      <div className="nav__buttons">
        {currentUser && <Signout />}
        {/* <Button onClick={toggleTheme}>
          {darkTheme ? (
            <i className="fa-sharp fa-solid fa-moon" />
          ) : (
            <i className="fa-sharp fa-solid fa-sun" />
          )}{" "}
          <span style={{ fontSize: "0.5rem" }}>beta</span>
        </Button> */}
      </div>
    </div>
  );
};
