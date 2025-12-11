from collections import defaultdict
from constants import GENRE_PRIORITY

GENRE_PRIORITY = [
    "rap", "hip hop", "melodic rap", "edm", "r&b",
    "trap soul", "emo rap", "afrobeats", "pop"
]

def choose_primary_genre(genres):
    """Select the most relevant genre using priority list; ignore unknown genres."""
    for g in GENRE_PRIORITY:
        if g in genres:
            return g
    return None  # unknown genres should be skipped

def normalize_tracks(tracks):
    """Add primary genre and track position; skip tracks with unknown genre."""
    normalized = [] 

    for idx, track in enumerate(tracks):
        primary_genre = choose_primary_genre(track.get("genres", []))
        if primary_genre is None:
            continue  # skip tracks not in genre list

        normalized.append({
            "track_name": track["track_name"],
            "artists": track["artists"],
            "genre": primary_genre,
            "position": idx
        })

    return normalized

def analyze_genres(tracks):
    """Return genre counts and list of positions per genre."""
    genre_counts = defaultdict(int)
    genre_positions = defaultdict(list)

    for t in tracks:
        genre_counts[t["genre"]] += 1
        genre_positions[t["genre"]].append(t["position"])

    return genre_counts, genre_positions

#starting with 3 acts
def top_n_genres(genre_counts, n=3): 
    """Return the top N genres by count."""
    return sorted(
        genre_counts.keys(),
        key=lambda g: genre_counts[g],
        reverse=True
    )[:n]

#tracks with a genre have their positions stored in an array. Indices are then summed up, and divided by number of tracks with that genre.
def average_position(positions): 
    """Return the average track position for a genre."""
    return sum(positions) / len(positions)
