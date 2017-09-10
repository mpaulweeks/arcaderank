
const API = {};
const matches = [];
var blacklist = [];

const HANDLE = "@mpaulweeks".toLowerCase();


function processTweet(tweet){
  if (blacklist.includes(tweet.user)){
    return;
  }
  if (!tweet.text.toLowerCase().startsWith(HANDLE)){
    return;
  }
  var body = tweet.text.substring(HANDLE.length + 1);
  matches.push({
    id: tweet.id,
    user: tweet.user,
    timestamp: tweet.timestamp,
    body: body,
  });
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
