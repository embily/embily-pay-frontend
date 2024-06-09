# Embily Swap Frontend

## Running / Development

* `ember serve --port 4201`

### Building

* `docker build  --no-cache . -t embily-pay-frontend`
* `docker run -v $PWD:/app -it embily-pay-frontend /app/build.sh production` - production
* `docker run -v $PWD:/app -it embily-pay-frontend /app/build.sh staging` - staging

### Configuration

* `config/environment.js`
