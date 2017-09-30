import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tweet } from 'react-twitter-widgets'
import API from './API';

class Matchup extends Component {
  render() {
    var { data } = this.props;
    return (
      <tr>
        {data.names.map(function(n, i){
          if (n[0] === '@'){
            var withoutAt = n.substring(1);
            var twitterUrl = `https://twitter.com/${withoutAt}`;
            return <td key={i}><a href={twitterUrl}>{withoutAt}</a></td>
          } else {
            return <td key={i}>{n}</td>
          }
        })}
        <td>{data.setWin}-{data.setLoss}</td>
        <td>{data.win}-{data.loss}</td>
      </tr>
    )
  }
}

class Game extends Component {
  render() {
    var { data } = this.props;
    return (
      <div>
        <h3>{data.key}</h3>
        <table>
          <thead>
            <tr>
              <th>Player 1</th>
              <th>Player 2</th>
              <th>Sets</th>
              <th>Rounds</th>
            </tr>
          </thead>
          <tbody>
            {data.matchups.map(function(mu) {
              return <Matchup key={mu.key} data={API.sortMatchup(mu)} />
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

class MainView extends Component {
  render() {
    API.init(this.props.data);
    var games = API.compileMatches();
    return (
      <div>
        <Tweet tweetId='906987816541925377'/>
        <div>
          This page automatically refreshes every 30 seconds. Tweeted results should show up here within a minute.
        </div>
        {games.map(function(game) {
          return <Game key={game.key} data={game} />
        })}
      </div>
    )
  }
}

const View = {};
View.initApp = function(){
  API.fetchData()
    .then(function(data) {
      ReactDOM.render(
        <MainView data={data}/>,
        document.getElementById('root')
      );
    })
    .catch(function (error){
      // todo: display message about 'failed to load'
    })
    .then(function(){
      setTimeout(View.initApp, 30000);
    });
};

export default View;
