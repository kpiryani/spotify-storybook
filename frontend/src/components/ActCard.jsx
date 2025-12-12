import TrackList from "./TrackList";

export default function ActCard({ actKey, act }) {

  const genreStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: "1.2rem",
    color: "#ffffffff",
    textShadow: "0 0 5px #ffffffff, 0 0 10px #ffffffff",
    lineHeight: 1.5,
    marginTop: "1rem"
  };

  return (
    <div className="act-card">
      <div className="act-header">
        <h2>{actKey}: {act.title}</h2>
        <span className="genre">{act.dominant_genre}</span>
      </div>

      <p className="description" style={genreStyle}>
        {act.description}
      </p>

      <p className="track-count">
        {act.track_count} tracks
      </p>

      <TrackList tracks={act.tracks} />
    </div>
  );
}
