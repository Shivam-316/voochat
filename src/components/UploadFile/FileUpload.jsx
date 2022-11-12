import { ThemedButton } from "../StyledButtons/Button";
import { ADD_IMAGE_ACTION } from "../Channel/UserChannel";
import "./fileupload.css";

export const FileUpload = ({ postingMessage, newMessageStateDispatch }) => {
  const handelFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      newMessageStateDispatch(
        ADD_IMAGE_ACTION({
          previewImageURL: URL.createObjectURL(file),
          messageImage: file,
        }),
      );
    }
  };

  return (
    <div className="fileupload__container" style={{"--order": 1}}>
      <ThemedButton
        style={{ borderRadius: "5px"}}
        disabled={postingMessage}>
        <label htmlFor="upload_image">
          <i className="fa-sharp fa-solid fa-upload"></i>
        </label>
      </ThemedButton>
      <input
        className="fileupload__input"
        onClick={(e) => (e.target.value = "")}
        onChange={handelFileUpload}
        type="file"
        accept="image/*"
        id="upload_image"
        name="upload_image"
        disabled={postingMessage}
      />
    </div>
  );
};
