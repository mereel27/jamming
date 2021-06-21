let accessToken;
const clientID = process.env.REACT_APP_API_KEY;
const redirectURI = 'https://jamforlen.surge.sh';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    //Check for access token.
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      //Wipes the access token and URL parameters.
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  async search(term) {
    const accessToken = Spotify.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) {
      return [];
    } else {
      return jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        track: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        sample: track.preview_url
      }));
    }
  },

  async savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) {
      return;
    }
    let userID;
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    //Fetching user's ID:
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: headers,
    });
    const jsonResponse = await response.json();
    userID = jsonResponse.id;

    //Creating new playlist and fetching playlist's ID:
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userID}/playlists`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: name }),
      }
    );
    const jsonPlaylist = await playlistResponse.json();
    let playlistID = jsonPlaylist.id;

    //Adding track's to playlist and fetching new ID:
    const newPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ uris: trackURIs })
      }
    );
    const jsonNewPlaylistResponse = await newPlaylistResponse.json();
    playlistID = jsonNewPlaylistResponse.id;
  },
};

export default Spotify;
