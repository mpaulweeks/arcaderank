import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tweet } from 'react-twitter-widgets'
import API from './API';

class Matchup extends Component {
  render() {
    var { data } = this.props;
    return (
      <tr>
        <td>{data.names[0]}</td>
        <td>{data.names[1]}</td>
        <td>{data.setWin}-{data.setLoss}</td>
        <td>{data.wins}-{data.losses}</td>
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
        <Tweet tweetId='906987816541925377'/>
        <div>
          Refresh this page in 1-2 minutes and results should show up.
        </div>
        {data.map(function(game) {
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
      API.init(data);
      ReactDOM.render(
        <MainView />,
        document.getElementById('root')
      );
    })
    .catch(function (error){
      // todo: display message about 'failed to load'
    })
};

export default View;
