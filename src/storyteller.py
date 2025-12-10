from constants import GENRE_STORY_MAP, ACT_TITLES

def build_acts(tracks, top_genres, genre_positions):
    """
    Acts take into account a relative frequency of the most common genre at a certain point throughout the playlist.
    3 acts are generated to create a "storyline" to show how music taste has evolved over time.
    Each act corresponds to one of the top genres but uses the earliest occurrence in the playlist to order them.
    """
    ordered_genres = sorted(
        top_genres,
        key=lambda g: min(genre_positions[g])
    )

    acts = {}
    act_keys = ["Act I", "Act II", "Act III"]

    for act, genre in zip(act_keys, ordered_genres):
        act_tracks = [t for t in tracks if t["genre"] == genre]

        acts[act] = {
            "title": ACT_TITLES[act],
            "dominant_genre": genre,
            "description": GENRE_STORY_MAP[genre],
            "track_count": len(act_tracks),
            "tracks": [
                {
                    "track_name": t["track_name"],
                    "artists": t["artists"]
                }
                for t in act_tracks
            ]
        }

    return acts 
