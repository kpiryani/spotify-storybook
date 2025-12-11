import TrackList from "./TrackList";

export default function ActCard({ actKey, act }) {
  return (
    <div className="act-card">
      <div className="act-header">
        <h2>{actKey}: {act.title}</h2>
        <span className="genre">{act.dominant_genre}</span>
      </div>

      <p className="description">{act.description}</p>

      <p className="track-count">
        {act.track_count} tracks
      </p>

      <TrackList tracks={act.tracks} />
    </div>
  );
}
