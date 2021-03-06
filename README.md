*Shut down twitter + server on 2021/02/16 due to lack of use*

# arcaderank

Python webapp/scraper for tracking arcade rankings (via tweets)

![@8BitDojoArcade](https://twitter.com/8BitDojoArcade)

## Dependencies
![twitterscraper](https://github.com/taspinar/twitterscraper)

## Installation

### Website

Static React files compiled via npm. Deploy with:
```
./bash/deploy.sh
```

### Tweet Scraper

#### Setup virtualenv
```
./install/setup_venv.sh
```

#### Setup env

Expected `.env` fields
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_REGION_NAME
S3_BUCKET_NAME
```

#### Setup crontab
```
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed

* * * * * ec2-user cd /home/ec2-user/arcaderank && ./bash/cronjob.sh
```

#### Setup server

Serves JSON data. See `install/nginx.conf`
