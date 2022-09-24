import { ThemedButton } from "../Buttons/Button";
import { ADD_IMAGE_ACTION } from "../UserChannel/Channel";
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
    <div className="fileupload__container">
      <ThemedButton style={{ borderRadius: "5px", padding: "0" }} disabled={postingMessage}>
        <label htmlFor="upload_image" style={{ padding: "1rem" }}>
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
