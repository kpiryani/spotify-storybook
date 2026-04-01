# Spotify Storybook

## Overview

Spotify Storybook turns a Spotify playlist into a 3-act genre "story".

The backend is now a **single Flask app** that:
1. handles Spotify OAuth,
2. fetches playlist + track + artist-genre data from Spotify,
3. runs analysis in memory,
4. returns the final acts JSON directly from one endpoint.

There is no longer a file-based two-step flow for normal usage.

---

## Prerequisites

- Python 3.10+
- A Spotify app (Client ID + Client Secret)

Install dependencies:

```bash
pip install flask requests python-dotenv
```

---

## Environment Variables

Create a `.env` file (project root or `src/`) with:

```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
FLASK_SECRET_KEY=any_random_secret
```

> Note: `redirect_uri` is currently set in code in `src/json_retrieval.py`. Make sure the same callback URL is added in your Spotify app settings.

---

## Run the Unified Backend

From the repository root:

```bash
python src/json_retrieval.py
```

The Flask server starts on `http://localhost:5000`.

---

## Endpoints

- `GET /login`  
  Starts Spotify OAuth.

- `GET /callback`  
  OAuth callback route used by Spotify.

- `GET /refresh-token`  
  Refreshes the Spotify access token using the refresh token in session.

- `GET /analyze?playlist=<playlist name>`  
  Runs the full in-memory pipeline and returns acts JSON.

Example:

```text
http://localhost:5000/analyze?playlist=night%20lights
```

Behavior:
- If not authenticated, `/analyze` redirects to `/login`.
- If `playlist` is missing, returns `400`.
- If playlist is not found, returns `404`.

---

## What Changed

- `src/json_retrieval.py` now performs retrieval + analysis in one request flow.
- The hardcoded playlist/file-output constants were removed from that flow.
- No `json.dump` writes are required for the `/analyze` workflow.
- `src/analyzer.py` now correctly uses `GENRE_PRIORITY` from `src/constants.py` without redefining it.

---

## Notes on `main.py`

`src/main.py` is the older file-based runner and is **not required** for the unified `/analyze` endpoint flow.

