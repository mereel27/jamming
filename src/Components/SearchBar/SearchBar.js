import React from 'react';
import './SearchBar.css';

const preValue = window.sessionStorage.getItem('inputValue');

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { term: preValue || '' };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(e) {
    const input = e.target.value;
    this.setState({ term: input });
    window.sessionStorage.setItem('inputValue', input);
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          defaultValue={preValue}
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
        />
        <button onClick={this.search} className="SearchButton">SEARCH</button>
      </div>
    );
  }
}

export default SearchBar;
