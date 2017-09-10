
const API = {};
const matches = [];
var blacklist = [];

const HANDLE = "@8BitDojoArcade".toLowerCase();


function processTweet(tweet){
  if (blacklist.includes(tweet.user)){
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
    user: tweet.user,
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
  var s = Object.assign({}, m);
  s.key = names.join(', ');
  return s;
}

API.compileMatches = function(){
  var matchups = {};
  matches.forEach(function (m){
    var game = matchups[m.game] || {};
    var sm = sortMatch(m);
    var mu = game[sm.key] || [];
    mu.push(sm);
    game[sm.key] = mu;
    matchups[m.game] = game;
  })
  return matchups;
}

API.init = function(rawData){
  console.log(rawData);
  blacklist = rawData.blacklist;
  rawData.tweets.forEach(processTweet);
}

API.all = function(){
  return matches;
}

export default API;
