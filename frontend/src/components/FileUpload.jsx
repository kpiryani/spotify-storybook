export default function FileUpload({ onFileUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        onFileUpload(jsonData);
      } catch (error) {
        alert("Error parsing JSON file. Please make sure it's a valid JSON file.");
        console.error("JSON parse error:", error);
      }
    };
    reader.onerror = () => {
      alert("Error reading file.");
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-input" className="upload-label">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        Upload Playlist JSON
      </label>
      <input
        id="file-input"
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <p className="upload-hint">Select a JSON file containing your playlist data</p>
    </div>
  );
}

