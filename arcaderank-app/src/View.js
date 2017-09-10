import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import API from './API';

class MainView extends Component {
  render() {
    var {
      all_tweets
    } = this.props;
    return (
      <div>
        <div>Hello world</div>
        <div>{JSON.stringify(all_tweets)}</div>
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
        <MainView
          all_tweets={API.all()}
        />,
        document.getElementById('root')
      );
    });
};

export default View;
