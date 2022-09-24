import { formatRelative } from "date-fns";
import React from "react";
import "./message.css";

const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

export const Message = ({
  createdAt = null,
  text = "",
  imageURL = null,
  displayName = "",
  photoURL = "",
  userColor = "hsl(19, 100%, 50%)",
}) => {
  return (
    <div className="message__container">
      <div className="message__avatar-container">
        {photoURL ? (
          <img className="message__avatar" src={photoURL} alt="Avatar" />
        ) : null}
      </div>

      <div className="message__user-container">
        {displayName ? <p style={{color: userColor}}>{displayName}</p> : null}

        {createdAt?.seconds ? (
          <span className="message__date">
            {formatRelative(new Date(createdAt.seconds * 1000), new Date())}
          </span>
        ) : null}
      </div>
      { text &&
        <p className="message__text">{text}</p>
      }

      {imageURL &&
        <div className="message__sentImg__container">
          <img onClick={() => openInNewTab(imageURL)} src={imageURL} alt="Sent Image" />
        </div>
      }
    </div>
  );
};
