export default function TrackList({ tracks }) {
  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    return null;
  }

  return (
    <ul className="track-list">
      {tracks.map((t, idx) => (
        <li key={idx}>
          <strong>{t.track_name}</strong>
          <span className="artists">
            {" "}— {Array.isArray(t.artists) ? t.artists.join(", ") : t.artists}
          </span>
        </li>
      ))}
    </ul>
  );
}
