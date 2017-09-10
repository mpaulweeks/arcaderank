git pull
source venv/bin/activate
# https://stackoverflow.com/a/20909045/6461842
env $(cat .env | xargs) python -m py.cronjob
