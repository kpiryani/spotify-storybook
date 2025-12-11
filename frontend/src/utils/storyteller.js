const GENRE_STORY_MAP = {
  "rap": "The energy sharpens. Focus locks in. Every beat feels deliberate.",
  "melodic rap": "Emotion seeps through the cracks. Reflection without losing pace.",
  "r&b": "Late nights, soft lights, and unspoken thoughts linger.",
  "hip hop": "Momentum builds. Confidence grows louder.",
  "afrobeats": "Release arrives. Movement replaces restraint.",
  "edm": "Lights flare. Motion takes over. Time dissolves.",
  "pop": "Clarity, uplift, and a sense of closure.",
};

const ACT_TITLES = {
  "Act I": "The Awakening",
  "Act II": "Gathering Momentum",
  "Act III": "Full Speed Ahead"
};

export function buildActs(tracks, topGenres, genrePositions) {
  /**
   * Acts take into account a relative frequency of the most common genre at a certain point throughout the playlist.
   * 3 acts are generated to create a "storyline" to show how music taste has evolved over time.
   * Each act corresponds to one of the top genres but uses the earliest occurrence in the playlist to order them.
   */
  const orderedGenres = [...topGenres].sort(
    (a, b) => Math.min(...genrePositions[a]) - Math.min(...genrePositions[b])
  );

  const acts = {};
  const actKeys = ["Act I", "Act II", "Act III"];

  for (let i = 0; i < actKeys.length && i < orderedGenres.length; i++) {
    const act = actKeys[i];
    const genre = orderedGenres[i];
    const actTracks = tracks.filter(t => t.genre === genre);

    acts[act] = {
      title: ACT_TITLES[act],
      dominant_genre: genre,
      description: GENRE_STORY_MAP[genre] || "A musical journey unfolds.",
      track_count: actTracks.length,
      tracks: actTracks.map(t => ({
        track_name: t.track_name,
        artists: t.artists
      }))
    };
  }

  return acts;
}

