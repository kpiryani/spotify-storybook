const GENRE_STORY_MAP = {
  "rap": "Bars hit hard. Energy spikes. You’re owning the room, whether it’s virtual or real.",
  "melodic rap": "Vibes hit deep. Feels personal, like someone’s spilling their soul on the beat.",
  "r&b": "Late-night feels. Smooth grooves. Heartstrings tugging with every note.",
  "hip hop": "Step up, flex. Momentum’s real. Confidence loud enough to wake the block.",
  "afrobeats": "Can’t sit still. Feet move before your brain catches up. Pure release.",
  "edm": "Lights, bass, chaos — and suddenly, you’re unstoppable. Time? Who cares.",
  "pop": "Hooks that stick. Mood lifts. Feels like victory in three minutes flat.",
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

