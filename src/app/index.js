import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import YouTube from 'react-youtube';
const transparentGif = '';

let primus = new Primus('ws://localhost:3001/primus');
let debug = true;

class Video extends React.Component {

  componentDidUpdate() {
    console.log('PROPS', this.props.progress);
  }

  render() {
    const url = 'https://www.youtube.com/embed?autoplay=1&listType=search&list=' + encodeURIComponent(this.props.query);
    console.log('URL', url);
    const opts = {
      height: '100%',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        controls: 0,
        loop: 1,
        modestbranding: 1,
        listType: "search",
        list: this.props.query
      }
    };
    return (
      <YouTube key={this.props.query} opts={opts} onReady={this._onReady}/>);
  }

  _onReady(event) {
    let target = event.target;
    // access to player in all event handlers via event.target
    setTimeout(() => {
      // console.log('NOWNOWNOW', target);
      // console.log(target.getVideoData());
      // console.log(target.getDuration());
      target.setVolume(0);
      target.playVideo();
    }, 1000);
    //console.log('ON READY',event.target.seekTo(10));
    //event.target.pauseVideo();
  }
}

class Display extends React.Component {

  componentDidMount() {
    primus.on('data', (data) => {
      if (debug) console.debug(data);
      this.setState(data);
    });
  }

  render() {
    let meta = _.get(this.state, 'meta', {});
    let pic = _.get(this.state, 'pic', transparentGif);
    let progressSeconds = 0;
    let progressPercent = 0;
    if (_.get(this.state, 'progress.current', 0)) {
      let progress = this.state.progress;
      progressSeconds = ( progress.current - progress.start ) / 1000;
      progressPercent = Math.round((progress.current - progress.start) / ( progress.end - progress.start ) * 10000) / 100;
    }
    let searchQuery = '';
    if (_.get(meta, 'asar', false) && _.get(meta, 'minm', false))
      searchQuery = _.get(meta, 'asar') + ' ' + _.get(meta, 'minm');
    return (
      <div className="full">
        <div className="details">
          <If condition={_.has(meta, 'asal')}>
            <div>Album: {_.get(meta, 'asal')}</div>
          </If>
          <If condition={_.has(meta, 'asar')}>
            <div>Artist: {_.get(meta, 'asar')}</div>
          </If>
          <If condition={_.has(meta, 'minm')}>
            <div>{_.get(meta, 'minm')}</div>
          </If>
          <If condition={progressSeconds}>
            Progress: {progressSeconds} ({progressPercent}%)
          </If>
        </div>
        <If condition={searchQuery.length}>
          <Video key={searchQuery} query={searchQuery} progress={progressPercent} className="full-video"/>
        </If>
      </div>
    )
  }
}


primus.on('open', () => {
  console.log('Connection is alive and kicking');
});

ReactDOM.render(
  <Display/>,
  document.getElementById('root')
);


/*

 <If condition={false && debug}>
 <pre>
 {JSON.stringify(this.state)}
 </pre>
 </If>

 */