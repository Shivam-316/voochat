import React from "react";
import { useEffect, useRef, useState } from "react";
import { ThemedButton } from "../StyledButtons/Button";
import "./deviceselect.css";
export const SelectDevice = ({
  peerConnection: pc,
  mediaSource: mediaRef,
  getDeviceStream,
}) => {
  const videoSelect = useRef();
  const audioSelect = useRef();

  const [showDeviceOptions, setShowDeviceOptions] = useState(false);

  useEffect(() => {
    async function getConnectedDevices(type) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === type);
    }

    if (showDeviceOptions) {
      getConnectedDevices("videoinput").then((devices) => {
        videoSelect.current.innerHTML = ``;

        devices
          .map((device) => {
            const cameraOption = document.createElement("option");
            cameraOption.label = device.label;
            cameraOption.value = device.deviceId;

            return cameraOption;
          })
          .forEach((cameraOption) => videoSelect.current.add(cameraOption));
      });

      getConnectedDevices("audioinput").then((devices) => {
        audioSelect.current.innerHTML = ``;

        devices
          .map((device) => {
            const cameraOption = document.createElement("option");
            cameraOption.label = device.label;
            cameraOption.value = device.deviceId;

            return cameraOption;
          })
          .forEach((cameraOption) => audioSelect.current.add(cameraOption));
      });
    }
  }, [showDeviceOptions]);

  const handelDeviceChange = (e) => {
    // stopMedia(LocalVideo);
    getDeviceStream(e.target.value).then((stream) => {
      const newVideoTrack = stream.getVideoTracks()[0];
      const senders = pc.getSenders();
      const sender = senders.find(
        (sender) => sender.track.kind === newVideoTrack.kind,
      );
      sender.replaceTrack(newVideoTrack);
      mediaRef.current.srcObject = stream;
    });
  };

  return (
    <div className="device-options-container">
      {showDeviceOptions ? (
        <div>
          <div className="video-options">
            <label htmlFor="video-select">
              <i
                style={{
                  color: "var(--text-color-inactive)",
                  paddingRight: "0.5rem",
                }}
                className="fa-solid fa-video"></i>
            </label>
            <select
              id="video-select"
              ref={videoSelect}
              onChange={(e) => handelDeviceChange(e)}
            />
          </div>
          <div className="audio-options">
            <label htmlFor="audio-select">
              <i
                style={{
                  color: "var(--text-color-inactive)",
                  paddingRight: "0.5rem",
                }}
                className="fa-solid fa-microphone"></i>
            </label>
            <select
              id="audio-select"
              ref={audioSelect}
              onChange={(e) => handelDeviceChange(e)}
            />
          </div>
        </div>
      ) : null}
      <button
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "1rem",
          fontSize: "var(--large-font-size)",
          border: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
        onClick={() => setShowDeviceOptions((state) => !state)}>
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>
    </div>
  );
};
