pm2 start npm --name "client" -- start
python manage.py loaddata fixtures/roles.json
pm2 start ./run.sh --name "backend"
fuser -n tcp -k 8000

source venv/bin/activate && python manage.py runserver 0.0.0.0:8000