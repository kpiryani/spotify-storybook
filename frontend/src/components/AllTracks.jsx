export default function AllTracks({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <div className="all-tracks">
      <h2>All Tracks ({tracks.length})</h2>
      <div className="tracks-grid">
        {tracks.map((track, idx) => (
          <div key={idx} className="track-item">
            <strong>{track.track_name}</strong>
            <span className="artists">
              {" "}— {Array.isArray(track.artists) ? track.artists.join(", ") : track.artists}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

