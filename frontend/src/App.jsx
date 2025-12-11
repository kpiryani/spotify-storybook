import { useState } from "react";
import Timeline from "./components/Timeline";
import FileUpload from "./components/FileUpload";
import AllTracks from "./components/AllTracks";
import { normalizeTracks, analyzeGenres, topNGenres } from "./utils/analyzer";
import { buildActs } from "./utils/storyteller";

export default function App() {
  const [playlistData, setPlaylistData] = useState(null);
  const [acts, setActs] = useState(null);

  const handleFileUpload = (jsonData) => {
    try {
      // Validate the JSON structure
      if (!jsonData.playlist_name || !jsonData.tracks || !Array.isArray(jsonData.tracks)) {
        alert("Invalid playlist JSON. Expected 'playlist_name' and 'tracks' array.");
        return;
      }

      // Process the playlist using backend logic
      const normalizedTracks = normalizeTracks(jsonData.tracks);
      const { genreCounts, genrePositions } = analyzeGenres(normalizedTracks);
      const topGenres = topNGenres(genreCounts, 3);
      const generatedActs = buildActs(normalizedTracks, topGenres, genrePositions);

      setPlaylistData(jsonData);
      setActs(generatedActs);
    } catch (error) {
      alert("Error processing playlist: " + error.message);
      console.error("Processing error:", error);
    }
  };

  return (
    <div className="app">
      {!playlistData ? (
        <div className="upload-container">
          <h1>Spotify Playlist Story</h1>
          <p className="subtitle">Upload your playlist JSON to see its narrative</p>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      ) : (
        <>
          <h1>{playlistData.playlist_name}</h1>
          <p className="subtitle">
            {playlistData.num_tracks || playlistData.tracks.length} tracks · AI-generated narrative
          </p>

          {acts && <Timeline acts={acts} />}
          
          <AllTracks tracks={playlistData.tracks} />
        </>
      )}
    </div>
  );
} 
