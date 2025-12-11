const GENRE_PRIORITY = [
  "rap",
  "melodic rap",
  "r&b",
  "hip hop",
  "afrobeats",
  "edm",
  "pop",
  "trap soul",
  "emo rap",
  "country",
  "electronic"
];

function choosePrimaryGenre(genres) {
  /**Select the most relevant genre using priority list; ignore unknown genres.*/
  for (const g of GENRE_PRIORITY) {
    if (genres.includes(g)) {
      return g;
    }
  }
  return null; // unknown genres should be skipped
}

export function normalizeTracks(tracks) {
  const totalTracks = tracks.length - 1;
  const normalized = [];

  for (let idx = 0; idx < tracks.length; idx++) {
    const track = tracks[idx];
    const primaryGenre = choosePrimaryGenre(track.genres || []);
    if (primaryGenre === null) {
      continue;
    }

    normalized.push({
      track_name: track.track_name,
      artists: track.artists,
      genre: primaryGenre,
      position: idx / totalTracks // normalization
    });
  }

  return normalized;
}

export function analyzeGenres(tracks) {
  /**Return genre counts and list of positions per genre.*/
  const genreCounts = {};
  const genrePositions = {};

  for (const t of tracks) {
    if (!genreCounts[t.genre]) {
      genreCounts[t.genre] = 0;
      genrePositions[t.genre] = [];
    }
    genreCounts[t.genre] += 1;
    genrePositions[t.genre].push(t.position);
  }

  return { genreCounts, genrePositions };
}

// starting with 3 acts
export function topNGenres(genreCounts, n = 3) {
  /**Return the top N genres by count.*/
  return Object.keys(genreCounts)
    .sort((a, b) => genreCounts[b] - genreCounts[a])
    .slice(0, n);
}

