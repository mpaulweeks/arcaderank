
import json

from twitterscraper import query_tweets
from twitterscraper.main import JSONEncoder


# All tweets matching either Trump or Clinton will be returned. You will get at
# least 10 results within the minimal possible time/number of requests
tweets = query_tweets('@mpaulweeks', 10)
with open('out.json', 'w') as output:
    json.dump(tweets, output, cls=JSONEncoder)
