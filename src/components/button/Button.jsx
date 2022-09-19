import React from "react";

export const Button = ({ onClick = null, children = null }) => {
  return <button onClick={onClick}>{children}</button>;
};
