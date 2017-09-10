import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class MainView extends Component {
  render() {
    return (
      <div>Hello world</div>
    )
  }
}

const View = {};
View.initApp = function(){
  ReactDOM.render(
    <Loading />,
    document.getElementById('root')
  );
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
        <MainView data=data/>,
        document.getElementById('root')
      );
    });
};

export default View;
