/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from "react";
import "./streamshandler.css";

function getDeviceStream(deviceId, kind) {
  console.log("stream get");
  let constraints;

  if (kind === "videoinput") {
    constraints = {
      video: { deviceId: { exact: deviceId } },
    };
  } else if (kind === "audioinput") {
    constraints = {
      audio: { deviceId: { exact: deviceId } },
    };
  }

  return navigator.mediaDevices.getUserMedia(constraints);
}

function stopMedia(source) {
  console.log("Stopped", source);
  source.current.srcObject?.getTracks().forEach((track) => {
    track.stop();
    source.current.srcObject.removeTrack(track);
  });
  source.current.srcObject = null;
}

export default function StreamsHandler({
  peerConnection: pc,
  LocalVideoRef,
  RemoteVideoRef,
  AudioRef,
  closeActiveStreams,
}) {
  const videoSelect = useRef(null);
  const audioSelect = useRef(null);

  const [showDeviceOptions, setShowDeviceOptions] = useState(false);

  closeActiveStreams.current = () => {
    console.log("streams");
    stopMedia(LocalVideoRef);
    stopMedia(RemoteVideoRef);
    stopMedia(AudioRef);

    pc.getSenders().forEach((sender) => pc.removeTrack(sender));
    pc.close();
    pc = null;
  };

  useEffect(() => {
    async function getConnectedDevices(type) {
      if (type === "videoinput") {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getVideoTracks().forEach((track) => track.stop());
      }

      if (type === "audioinput") {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getAudioTracks().forEach((track) => track.stop());
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === type);
    }

    getConnectedDevices("videoinput").then((devices) => {
      videoSelect.current.innerHTML = ``;
      devices
        .map((device) => {
          const cameraOption = document.createElement("option");
          cameraOption.label = device.label.length > 20 ? device.label.slice(0, 20) + "..." : device.label;
          cameraOption.value = device.deviceId;
          return cameraOption;
        })
        .forEach((cameraOption) => videoSelect.current.add(cameraOption));

      videoSelect.current.selectedIndex = 0;
      getDeviceStream(videoSelect.current.value, "videoinput").then(
        (stream) => {
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
          stopMedia(LocalVideoRef);
          LocalVideoRef.current.srcObject = stream;
          console.log(LocalVideoRef.current.srcObject.getTracks());
        },
      );
    });

    getConnectedDevices("audioinput").then((devices) => {
      audioSelect.current.innerHTML = ``;

      devices
        .map((device) => {
          const cameraOption = document.createElement("option");
          cameraOption.label = device.label.length > 30 ? device.label.slice(0, 30) + "..." : device.label;
          cameraOption.value = device.deviceId;

          return cameraOption;
        })
        .forEach((cameraOption) => audioSelect.current.add(cameraOption));

      audioSelect.current.selectedIndex = 0;
      getDeviceStream(audioSelect.current.value, "audioinput").then(
        (stream) => {
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
          stopMedia(AudioRef);
          AudioRef.current.srcObject = stream;
        },
      );
    });
  }, [pc, LocalVideoRef]);

  const handelDeviceChange = (e) => {
    const deviceKind = e.target.id;
    stopMedia(LocalVideoRef);
    getDeviceStream(e.target.value, deviceKind).then((stream) => {
      if (deviceKind === "videoinput") {
        const newVideoTrack = stream.getVideoTracks()[0];

        const senders = pc.getSenders();
        const sender = senders.find((s) => s.track.kind === newVideoTrack.kind);

        sender.replaceTrack(newVideoTrack);

        LocalVideoRef.current.srcObject = stream;
      } else if (deviceKind === "audioinput") {
        const newAudioTrack = stream.getAudioTracks()[0];

        const senders = pc.getSenders();
        const sender = senders.find((s) => s.track.kind === newAudioTrack.kind);

        sender.replaceTrack(newAudioTrack);
        AudioRef.current.srcObject = stream;
      }
    });
  };

  return (
    <div className="device-options-container">
      <div style={showDeviceOptions ? {} : { display: "none" }}>
        <div className="video-options">
          <label htmlFor="videoinput">
            <i className="fa-solid fa-video" />
          </label>
          <select
            id="videoinput"
            ref={videoSelect}
            onChange={(e) => handelDeviceChange(e)}
          />
        </div>
        <div className="audio-options">
          <label htmlFor="audioinput">
            <i className="fa-solid fa-microphone" />
          </label>
          <select
            id="audioinput"
            ref={audioSelect}
            onChange={(e) => handelDeviceChange(e)}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowDeviceOptions((state) => !state)}>
        <i className="fa-solid fa-ellipsis-vertical" />
      </button>
    </div>
  );
}
