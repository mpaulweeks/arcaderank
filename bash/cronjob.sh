source venv/bin/activate
env $(cat .env | xargs) python -m py.cronjob
