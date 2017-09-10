import json

from twitterscraper import query_tweets

DATA_PATH = 'data.json'


class SimpleTweet(dict):
    def __init__(self, id, user, text, timestamp):
        self.id = id
        self.user = user
        self.text = text
        self.timestamp = timestamp
        dict.__init__(self, self.__dict__)

    @classmethod
    def from_scraper(cls, tweet):
        return SimpleTweet(
            tweet.id,
            tweet.user,
            tweet.text,
            tweet.timestamp.isoformat(),
        )

    @classmethod
    def from_json(cls, tweet):
        return SimpleTweet(
            tweet['id'],
            tweet['user'],
            tweet['text'],
            tweet['timestamp'],
        )


def run():
    try:
        with open(DATA_PATH, 'r') as file:
            existing_tweets = json.load(file)
            data = {
                t.id: t for t in [
                    SimpleTweet.from_json(j) for j in existing_tweets
                ]
            }
    except Exception as e:
        print 'EXCEPTION:', e
        data = {}
    scraper_tweets = query_tweets('@mpaulweeks', 100)
    new_tweets_by_id = {
        t.id: SimpleTweet.from_scraper(t) for t in scraper_tweets
    }
    data.update(new_tweets_by_id)
    with open(DATA_PATH, 'w') as output:
        json.dump(data.values(), output)


if __name__ == "__main__":
    run()
