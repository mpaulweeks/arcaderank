
const API = {};
const matches = [];
var blacklist = [];

const HANDLE = "@8BitDojoArcade".toLowerCase();


function processTweet(tweet){
  if ((blacklist.users || []).includes(tweet.user)){
    return;
  }
  if ((blacklist.tweets || []).includes(tweet.id)){
    return;
  }
  if (!tweet.text.toLowerCase().startsWith(HANDLE)){
    return;
  }
  var body = tweet.text.substring(HANDLE.length + 1).toLowerCase();
  var sections = body.split(' ');
  var indexVs = Math.max(sections.indexOf('against'), sections.indexOf('versus'), sections.indexOf('vs'));
  if (indexVs < 0){
    return;
  }
  var opponent = sections[indexVs + 1];
  var indexGame = Math.max(sections.indexOf('in'));
  if (indexGame < 0){
    return;
  }
  var game = sections[indexGame + 1];
  var score = [];
  sections.forEach(function (sec){
    var indexHyphen = Math.max(sec.indexOf('-'));
    if (indexHyphen >= 0){
      var scores = sec.split('-');
      scores.forEach(function (s){
        score.push(parseInt(s, 10));
      })
    }
  });
  matches.push({
    id: tweet.id,
    user: '@' + tweet.user,
    opponent: opponent,
    game: game,
    score: score,
    timestamp: tweet.timestamp,
    body: body,
  });
}

function sortMatch(m){
  var names = [m.user, m.opponent];
  names.sort();
  var s = {
    game: m.game,
    key: names.join(', '),
    names: names,
  };
  if (names[0] === m.user){
    s.wins = m.score[0];
    s.losses = m.score[1];
  } else {
    s.wins = m.score[1];
    s.losses = m.score[0];
  }
  s.setWin = s.wins > s.losses ? 1 : 0;
  s.setLoss = s.wins < s.losses ? 1 : 0;
  return s;
}

API.compileMatches = function(){
  var games = {};
  matches.forEach(function (m){
    var game = games[m.game] || {};
    var sm = sortMatch(m);
    var mu = game[sm.key];
    if (!mu){
      mu = sm;
    } else {
      mu.wins += sm.wins;
      mu.losses += sm.losses;
      mu.setWin += sm.setWin;
      mu.setLoss += sm.setLoss;
    }
    game[sm.key] = mu;
    games[m.game] = game;
  });
  var result = [];
  for (var gkey in games){
    var gameData = games[gkey];
    var matchups = [];
    for (var mukey in gameData){
      matchups.push(gameData[mukey]);
    }
    result.push({
      key: gkey,
      matchups: matchups,
    });
  }
  return result;
}

API.init = function(rawData){
  blacklist = rawData.blacklist;
  rawData.tweets.forEach(processTweet);
}

API.all = function(){
  return matches;
}

API.fetchData = function(){
  const urls = [
    'http://static.mpaulweeks.com/8bit/data.json',
    'https://s3.amazonaws.com/arcaderank/all_tweets.json',
  ];
  var urlIndex = 0;
  function tryFetch(){
    var url = urls[urlIndex];
    return fetch(url)
      .then(function(response) {
        if(!response.ok) {
          throw new Error('Failed to get: ' + url);
        }
        else {
          return response.json();
        }
      })
      .catch(function(error) {
        console.log(error);
        urlIndex += 1;
        if (urlIndex < urls.length){
          return tryFetch();
        } else {
          throw error;
        }
      })
  }
  return tryFetch();
}

export default API;
