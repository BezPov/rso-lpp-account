Building the Docker image: 

`docker image build -t lpp-account:1.0.0 .`

Running the Docker image:

`docker container run --publish 8000:8080 --detach --name lpp-account lpp-account:1.0.0`

Removing the Docker image:

`docker container remove --force lpp-account`