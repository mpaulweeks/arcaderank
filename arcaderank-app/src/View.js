import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import API from './API';

class Matchup extends Component {
  render() {
    var { data } = this.props;
    return (
      <tr>
        <td>{data.names[0]}</td>
        <td>{data.names[1]}</td>
        <td>{data.setWin}</td>
        <td>{data.setLoss}</td>
        <td>{data.wins}</td>
        <td>{data.losses}</td>
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
              <th>Player1</th>
              <th>Player2</th>
              <th>Set Wins</th>
              <th>Set Losses</th>
              <th>Total Wins</th>
              <th>Total Losses</th>
            </tr>
          </thead>
          <tbody>
            {data.matchups.map(function(mu) {
              return <Matchup key={mu.key} data={mu} />
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

class MainView extends Component {
  render() {
    var data = API.compileMatches();
    return (
      <div>
        {data.map(function(game) {
          return <Game key={game.key} data={game} />
        })}
      </div>
    )
  }
}

const View = {};
View.initApp = function(){
  fetch('https://s3.amazonaws.com/arcaderank/all_tweets.json')
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      API.init(data);
      ReactDOM.render(
        <MainView />,
        document.getElementById('root')
      );
    });
};

export default View;
