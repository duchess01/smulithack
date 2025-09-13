import React, { useRef, useState } from "react";

const FileUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file); // send file back to parent
    }
  };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Styled upload button */}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        style={{
          padding: "10px 20px",
          borderRadius: "25px",
          border: "none",
          backgroundColor: "#0288d1",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.3s",
          display: "inline-block",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0277bd")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#0288d1")}
      >
        Upload File
      </button>

      {/* Optional: show selected file name */}
      {selectedFile && (
        <span style={{ marginLeft: "10px", fontSize: "0.9em", color: "#555" }}>
          {selectedFile.name}
        </span>
      )}
    </div>
  );
};

export default FileUpload;
