
const API = {};
let matches; // list
let blacklist; // object

const HANDLE = "@8BitDojoArcade".toLowerCase();

function cleanGame(rawGame){
  const illegalChars = ['.'];
  var result = rawGame.toUpperCase();
  illegalChars.forEach(function (c){
    result = result.split(c).join('');
  })
  return result;
}

function processTweet(tweet){
  const user = '@' + tweet.user.toLowerCase();
  const fullBody = tweet.text.toLowerCase();
  if ((blacklist.users || []).includes(user)){
    return;
  }
  if ((blacklist.tweets || []).includes(tweet.id)){
    return;
  }
  if (!fullBody.startsWith(HANDLE)){
    return;
  }
  const body = tweet.text.substring(HANDLE.length + 1).toLowerCase();
  const sections = body.split(' ');
  const indexVs = Math.max(sections.indexOf('against'), sections.indexOf('versus'), sections.indexOf('vs'));
  if (indexVs < 0){
    return;
  }
  const opponent = sections[indexVs + 1];
  const indexGame = Math.max(sections.indexOf('in'));
  if (indexGame < 0){
    return;
  }
  const game = cleanGame(sections[indexGame + 1]);
  const score = [];
  sections.forEach(function (sec){
    const indexHyphen = Math.max(sec.indexOf('-'));
    if (indexHyphen >= 0){
      const scores = sec.split('-');
      scores.forEach(function (s){
        score.push(parseInt(s, 10));
      })
    }
  });
  matches.push({
    id: tweet.id,
    user: user,
    opponent: opponent,
    game: game,
    score: score,
    timestamp: tweet.timestamp,
    body: body,
  });
}

function processMatch(m){
  const names = [m.user, m.opponent];
  names.sort();
  const s = {
    game: m.game,
    names: names,
    key: m.game + '/' + names.join('/'),
  };
  if (names[0] === m.user){
    s.win = m.score[0];
    s.loss = m.score[1];
  } else {
    s.win = m.score[1];
    s.loss = m.score[0];
  }
  s.setWin = s.win > s.loss ? 1 : 0;
  s.setLoss = s.win < s.loss ? 1 : 0;
  return s;
}

API.compileMatches = function(){
  var games = {};
  matches.forEach(function (m){
    var game = games[m.game] || {};
    var pMatch = processMatch(m);
    var matchup = game[pMatch.key];
    if (!matchup){
      matchup = pMatch;
    } else {
      matchup.win += pMatch.win;
      matchup.loss += pMatch.loss;
      matchup.setWin += pMatch.setWin;
      matchup.setLoss += pMatch.setLoss;
    }
    game[pMatch.key] = matchup;
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

function sortMatchupNames(matchup){
  const isBackwards = (
    matchup.setWin < matchup.setLoss ||
    (matchup.setWin === matchup.setLoss && matchup.win < matchup.loss)
  );
  if (isBackwards){
    return {
      game: matchup.game,
      names: matchup.names.reverse(),
      key: matchup.key,
      win: matchup.loss,
      loss: matchup.win,
      setWin: matchup.setLoss,
      setLoss: matchup.setWin,
    };
  } else {
    return matchup;
  }
}

API.sortMatchups = function(matchups){
  let sorted = [];
  matchups.forEach(function (m){
    sorted.push(sortMatchupNames(m));
  });
  function compare(a,b) {
    if (a.setWin * 10000 + a.win < b.setWin * 10000 + b.win)
      return -1;
    if (a.setWin * 10000 + a.win > b.setWin * 10000 + b.win)
      return 1;
    return 0;
  }
  return sorted.sort(compare).reverse();
}

API.init = function(rawData){
  blacklist = rawData.blacklist;
  matches = [];
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
