import React from "react";
import { CloseButton } from "../Button/Button";
import { REMOVE_IMAGE_ACTION } from "../Channel/Channel";
import './imageuploadpreview.css'

export const ImageUploadPreview = ({newMessageState, newMessageStateDispatch}) => {
  return (
    <div className={`preview ${!newMessageState.preview && "hide"}`}>
      <div>
        <CloseButton onClick={() => newMessageStateDispatch(REMOVE_IMAGE_ACTION())} />
        <img src={newMessageState.previewImageURL} />
      </div>
    </div>
  );
};
