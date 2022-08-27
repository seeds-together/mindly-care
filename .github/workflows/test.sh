echo "Access granted to Linode VM. Executing Commands"
echo "Stoping current container"

# Stop running container and remove its image
docker stop mindly-care-app
docker rm mindly-care-app
docker rmi 977977/mindly-care:latest

# Pull the updated image
docker pull 977977/mindly-care:latest

#Start container with updated image
echo "Starting new container"
docker run -d -p80:3000 --name mindly-care-app 977977/mindly-care:latest | container_id

#Copy certificates and .env from VM to container file system (Replace this with your files)
docker cp /root/db-mindly-care-ca-certificate.crt mindly-care-app:/home/mindly-care-app
docker cp /root/.env mindly-care-app:/home/mindly-care-app

echo "Success:Container Started"
exit
