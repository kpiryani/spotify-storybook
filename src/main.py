import json
from analyzer import normalize_tracks, analyze_genres, top_n_genres
from storyteller import build_acts

INPUT_PATH = "../data/pretest data.json" #SPECIFY INPUT FILE PATH HERE
OUTPUT_PATH = "../output/playlist_story.json" #SPECIFY OUTPUT FOLDER AND FILE NAME HERE (Pick anything that hasn't been used yet)

def main():
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        playlist = json.load(f)

    normalized_tracks = normalize_tracks(playlist["tracks"])
    genre_counts, genre_positions = analyze_genres(normalized_tracks)
    top_genres = top_n_genres(genre_counts, n=3)

    acts = build_acts(
        normalized_tracks,
        top_genres,
        genre_positions
    )

    output = {
        "playlist_name": playlist["playlist_name"],
        "num_tracks": playlist["num_tracks"],
        "acts": acts
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print("Playlist Acts Created Successfully :)")

if __name__ == "__main__":
    main()
