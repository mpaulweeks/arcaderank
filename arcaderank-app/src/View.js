import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
        ReactDOM.render(
          <Error />,
          document.getElementById('root')
        );
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      ReactDOM.render(
        <MainView
          all_tweets={data}
        />,
        document.getElementById('root')
      );
    });
};

export default View;
