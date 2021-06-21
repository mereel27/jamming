/* eslint-disable react/prop-types */
import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button onClick={this.removeTrack} className="Track-action">
          -
        </button>
      );
    } else {
      return (
        <button onClick={this.addTrack} className="Track-action">
          +
        </button>
      );
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <div><audio controls src={this.props.track.sample}></audio></div>
          <p>
            {this.props.track.track} | {this.props.track.album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
