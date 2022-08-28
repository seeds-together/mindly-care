<h1 align="center">
 <img src="https://user-images.githubusercontent.com/51237312/187054410-7d75fbc0-6b4e-4927-bc81-9ce0fa996367.png" width=300/>
</h1>
<h4 align="center">Spreading Mental Health Awareness with VR | A step towards a healthier psyche !</h4>
<div align="center">
<a href="http://mindlycare.xyz/" target="_blank">
<img width="200" alt="image" src="https://user-images.githubusercontent.com/51237312/187055782-6c36240f-d8c6-4206-8aa8-1a7708be1dcf.png">
</a>
</div>

## About ℹ️ 

Mindly Care is an attempt to solve this issue by creating mental health awareness, providing chat support with professionals and connecting people to make sure they don't feel alone. We aim to show mental illness is real and embrace the people suffering from mental illness, all with an immersive VR experience.

## Key Features 🧑‍💻

- Simulate parts affected by Mental Health Problems 
- Visualization of people seeking support on a VR 3D Globe
- Chat with Mental Health Professionals

<img src="https://user-images.githubusercontent.com/51237312/187060044-4eb7250b-cb66-454d-9b6d-1c6069005392.png" width=600/>
<img src="https://user-images.githubusercontent.com/51237312/187060049-afca488a-db98-400f-9623-6fdaecab409e.png" width=600/>

## Run Locally (Development Environment) ⚒️

#### You can run the application in two ways i.e through [Docker](https://www.docker.com/) or [Node.js](https://nodejs.org/en/)
- Docker 🐋

```bash
# Pull Image from DockerHub
$ docker pull 977977/mindly-care

# Start Container
$ docker start -d -p80:3000 --name mindly-care-app 977977/mindly-care 

# Stop Container 
$ docker stop mindly-care-app
```

- Node.js 🤹


```bash
# Clone the repository
$ git clone https://github.com/seeds-together/mindly-care
$ cd mindly-care

# Install and Build Packages
$ npm install
$ npm build

# Start the server (Listens on port 3000)
$ node index.js
```

## Tech Used 💻

- Development 
  - Frontend :
  
      ![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
      ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
      - Snowpack (Bundler)
      - WebXR (VR)
  
  - Backend :     
      ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
      ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
      ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
  
- Production:

    ![Linode](https://img.shields.io/badge/linode-00A95C?style=for-the-badge&logo=linode&logoColor=white) 
    ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
    ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
    - Linode VM, Managed MYSQL Database, Volumes and Domains
    - .xyz (Domain Provider)
  
## GitHub Practices and Tools Used

- GitHub Actions (CI/CD Pipeline) 
- GitHub Secrets
- Project Boards
- VS Code
- Twilio 

## Get in Touch
Feel free to reach out to us at mindlycaredev@gmail.com
