// import React, { useState, useEffect } from "react";

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [files, setFiles] = useState(
    JSON.parse(localStorage.getItem("files")) || []
  );
  const [currentFile, setCurrentFile] = useState(
    localStorage.getItem("currentFile") || null
  );
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    if (audioElement) {
      audioElement.addEventListener("ended", playNext);
      return () => {
        audioElement.removeEventListener("ended", playNext);
      };
    }
  }, [audioElement]);

  const playNext = () => {
    const currentIndex = files.findIndex((file) => file.data === currentFile);
    const nextIndex = (currentIndex + 1) % files.length;
    setCurrentFile(files[nextIndex].data);
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFiles([...files, { name: file.name, data: reader.result }]);
      setCurrentFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("currentFile", currentFile);
  }, [files, currentFile]);

  return (
    <div>
      <input type="file" accept="audio/*" onChange={onFileChange} />
      <audio ref={setAudioElement} src={currentFile} controls autoPlay />
      <div>
        {files.map((file, index) => (
          <div
            key={index}
            style={{ backgroundColor: "wheat" }}
            onClick={() => setCurrentFile(file.data)}
          >
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
