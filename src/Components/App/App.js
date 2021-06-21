import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'myPlaylist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find((saved) => saved.id === track.id)) {
      return;
    } else {
      const newList = this.state.playlistTracks.concat(track);
      const changedResults = this.state.searchResults.filter(saved => saved.id !== track.id);
      this.setState({ 
        playlistTracks: newList,
        searchResults: changedResults
      });
    }
  }

  removeTrack(track) {
    const newList = this.state.playlistTracks.filter(
      (saved) => saved.id !== track.id
    );
    const changedResults = [...this.state.searchResults];
    changedResults.unshift(track);
    this.setState({ 
      playlistTracks: newList,
      searchResults: changedResults
    });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  async savePlaylist() {
    const name = this.state.playlistName;
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    await Spotify.savePlaylist(name, trackURIs);
    this.setState({
      playlistName: 'myPlaylist',
      playlistTracks: [],
    });
  }

  async search(term) {
    const results = await Spotify.search(term);
    this.setState({ searchResults: results });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistTracks={this.state.playlistTracks}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
