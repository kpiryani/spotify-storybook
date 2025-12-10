from datetime import datetime
from dotenv import load_dotenv
import os
import requests
from flask import Flask, redirect, request, jsonify, session
import urllib.parse

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
        "scope": scope
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
        "client_secret": client_secret
    }

    response = requests.post(token_url, data=req_body)
    token_info = response.json()

    session["access_token"] = token_info["access_token"]
    session["refresh_token"] = token_info["refresh_token"]
    session["expires_at"] = datetime.now().timestamp() + token_info["expires_in"]

    return redirect("/playlists")

@app.route("/playlists")
def get_playlists():
    if "access_token" not in session:
        return redirect("/login")

    headers = {"Authorization": f"Bearer {session['access_token']}"}
    response = requests.get(api_base_url + "me/playlists?limit=50", headers=headers)
    data = response.json()
    playlists = data.get("items", [])

    specific_name = "60 bpm" #SPECIFY PLAYLIST NAME HERE

    playlist = next((p for p in playlists if p["name"] == specific_name), None)

    if not playlist:
        return jsonify({"error": f"Playlist '{specific_name}' not found"})

    playlist_id = playlist["id"]
    playlist_name = playlist["name"]

    # Get all tracks for this playlist (handle pagination)
    tracks = []
    url = f"{api_base_url}playlists/{playlist_id}/tracks?limit=100"
    while url:
        track_response = requests.get(url, headers=headers).json()
        for item in track_response.get("items", []):
            track_info = item["track"]
            track_name = track_info["name"]
            artists = [artist["name"] for artist in track_info["artists"]]

            # Get artist genres (take first artist as main)
            artist_id = track_info["artists"][0]["id"]
            artist_data = requests.get(f"{api_base_url}artists/{artist_id}", headers=headers).json()
            genres = artist_data.get("genres", [])

            tracks.append({
                "track_name": track_name,
                "artists": artists,
                "genres": genres
            })

        url = track_response.get("next")  # Spotify pagination

    result = {
        "playlist_name": playlist_name,
        "num_tracks": len(tracks),
        "tracks": tracks
    }

    return jsonify(result)


@app.route("/refresh-token")
def refresh_token():
    req_body = {
        "grant_type": "refresh_token",
        "refresh_token": session["refresh_token"],
        "client_id": client_id,
        "client_secret": client_secret
    }

    response = requests.post(token_url, data=req_body)
    new_token = response.json()

    session["access_token"] = new_token["access_token"]
    session["expires_at"] = datetime.now().timestamp() + new_token["expires_in"]

    return redirect("/playlists")

# -------------------- RUN --------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
