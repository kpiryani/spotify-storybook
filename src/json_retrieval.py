from datetime import datetime
import os
import urllib.parse

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request, session

from analyzer import analyze_genres, normalize_tracks, top_n_genres
from storyteller import build_acts

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

redirect_uri = "https://jumpingly-degressive-scarlett.ngrok-free.dev/callback"

auth_url = "https://accounts.spotify.com/authorize"
token_url = "https://accounts.spotify.com/api/token"
api_base_url = "https://api.spotify.com/v1/"


@app.route("/")
def index():
    return "Welcome to my Spotify App <a href='/login'>Login with Spotify</a>"


@app.route("/login")
def login():
    scope = "playlist-read-private user-top-read"

    params = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": scope,
    }

    return redirect(f"{auth_url}?{urllib.parse.urlencode(params)}")


@app.route("/callback")
def callback():
    if "error" in request.args:
        return jsonify({"error": request.args["error"]})

    req_body = {
        "code": request.args.get("code"),
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret,
    }

    response = requests.post(token_url, data=req_body)
    token_info = response.json()

    session["access_token"] = token_info["access_token"]
    session["refresh_token"] = token_info["refresh_token"]
    session["expires_at"] = datetime.now().timestamp() + token_info["expires_in"]

    return redirect("/")


def find_playlist_by_name(headers, playlist_name):
    url = api_base_url + "me/playlists?limit=50"

    while url:
        data = requests.get(url, headers=headers).json()
        playlists = data.get("items", [])

        playlist = next(
            (p for p in playlists if p.get("name", "").lower() == playlist_name.lower()),
            None,
        )
        if playlist:
            return playlist

        url = data.get("next")

    return None


def fetch_playlist_tracks(headers, playlist_id):
    tracks = []
    url = f"{api_base_url}playlists/{playlist_id}/tracks?limit=100"

    while url:
        track_response = requests.get(url, headers=headers).json()

        for item in track_response.get("items", []):
            track_info = item.get("track")
            if not track_info or not track_info.get("artists"):
                continue

            artist_id = track_info["artists"][0]["id"]
            artist_data = requests.get(
                f"{api_base_url}artists/{artist_id}", headers=headers
            ).json()
            genres = artist_data.get("genres", [])

            tracks.append(
                {
                    "track_name": track_info["name"],
                    "artists": [artist["name"] for artist in track_info["artists"]],
                    "genres": genres,
                }
            )

        url = track_response.get("next")

    return tracks


@app.route("/analyze")
def analyze_playlist():
    if "access_token" not in session:
        return redirect("/login")

    playlist_name = request.args.get("playlist", "").strip()
    if not playlist_name:
        return jsonify({"error": "Missing required query parameter: playlist"}), 400

    headers = {"Authorization": f"Bearer {session['access_token']}"}
    playlist = find_playlist_by_name(headers, playlist_name)

    if not playlist:
        return jsonify({"error": f"Playlist '{playlist_name}' not found"}), 404

    tracks = fetch_playlist_tracks(headers, playlist["id"])

    normalized_tracks = normalize_tracks(tracks)
    genre_counts, genre_positions = analyze_genres(normalized_tracks)
    top_genres = top_n_genres(genre_counts, n=3)

    acts = build_acts(normalized_tracks, top_genres, genre_positions)

    return jsonify(
        {
            "playlist_name": playlist["name"],
            "num_tracks": len(tracks),
            "acts": acts,
        }
    )


@app.route("/refresh-token")
def refresh_token():
    req_body = {
        "grant_type": "refresh_token",
        "refresh_token": session["refresh_token"],
        "client_id": client_id,
        "client_secret": client_secret,
    }

    response = requests.post(token_url, data=req_body)
    new_token = response.json()

    session["access_token"] = new_token["access_token"]
    session["expires_at"] = datetime.now().timestamp() + new_token["expires_in"]

    return redirect("/")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
