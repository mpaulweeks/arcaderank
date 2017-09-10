import json
import os

import boto3
from twitterscraper import query_tweets

DATA_PATH = 'data.json'
S3_PATH = 'all_tweets.json'


def _connect_to_bucket():
    keys = os.environ
    session = boto3.Session(
        aws_access_key_id=keys['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=keys['AWS_SECRET_ACCESS_KEY'],
        region_name=keys['S3_REGION_NAME'],
    )
    s3 = session.resource('s3')
    return s3.Bucket(keys['S3_BUCKET_NAME'])


def upload_s3():
    print ("uploading %s to %s" % (DATA_PATH, S3_PATH))
    with open(DATA_PATH, 'rb') as data:
        _connect_to_bucket().put_object(Key=S3_PATH, Body=data)


def download_s3():
    print ("downloading %s to %s" % (S3_PATH, DATA_PATH))
    _connect_to_bucket().download_file(Key=S3_PATH, Filename=DATA_PATH)


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


def load_data():
    try:
        print 'loading tweets from file'
        with open(DATA_PATH, 'r') as file:
            existing_tweets = json.load(file)
        print 'fetching tweets from Twitter'
        data = {
            t.id: t for t in [
                SimpleTweet.from_json(j) for j in existing_tweets
            ]
        }
    except Exception as e:
        print 'EXCEPTION:', e
        data = None
    return data


def run():
    data = load_data()
    if not data:
        download_s3()
        data = load_data()
    if not data:
        print 'something went horribly wrong'
    scraper_tweets = query_tweets('@mpaulweeks', 100)
    new_tweets_by_id = {
        t.id: SimpleTweet.from_scraper(t) for t in scraper_tweets
    }
    old_count = len(data)
    data.update(new_tweets_by_id)
    new_count = len(data)
    print 'updates: %d' % (new_count - old_count)
    if new_count == old_count:
        print 'nothing new, skipping save'
    else:
        print 'saving tweets locally'
        with open(DATA_PATH, 'w') as output:
            json.dump(data.values(), output)
        upload_s3()


if __name__ == "__main__":
    run()
