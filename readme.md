# Ark Server Manager

This Ark Server Manager provides the following functionality via a Web Interface to manage your Ark Server:

- **Start** Ark Server
- **Stop** Ark Server
- **Update** Ark Server
- **Status** of the Ark Server (is it up and running?)
- **Backup** Ark Server Save Game

## Prerequisite

- **Linux** (so far only tested on Ubuntu, but all Unix-based systems could work)
- **Nodejs** (https://nodejs.org/en/download/ or install via package manager of your OS, e.g. `apt-get install node` on Ubuntu)
- **Git** (https://git-scm.com/ or install via package manager of your OS, e.g. `apt-get install git` on Ubuntu)
- **Ark Server** must be installed and **steamcmd** must be available
- Ports **3000** and **3001** must be accessible for everyone who shall use the web interface. It might be necessary to configure an according Port forwarding in your router.

## Download & Start

- `git clone https://github.com/skanatiker/ark_server_manager` to download the program
- `npm install` to load all required dependencies
- `node server.js` to start the server
- Go to `https://<server ip or dns name>:3001`. The first call will take a while, don't worry. Currently you have to accept the certificate, because it is not valid at the moment. See next section about HTTPS. Then login with default username `admin` and password `admin`.
- After your first login the configuration dialog will open up. Please configure all required fields and change your admin password! 

## HTTPS

[Let's encrypt](https://letsencrypt.org/) is being used to generate an individual SSL certificate for everyone who runs the server. For now only the testing mode is used, which only provides non validated certificates. I am working on switching to production ready certificates. It will just take some more time. 

As soon as it is available, you will also have to configure your ports a bit differently. Let's encrypt requires the server to run on Port 80. Therefore you will have to configure a local port forwarding on your server. This could look like:

`sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000`
`sudo iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 3001`

## Support and Feedback
If any questions come up or you just want to give some feedback about the server, please don't hesitate to contact me via [skanatiker.dev@gmail.com](mailto:skanatiker.dev@gmail.com).

## Intention of this server manager
This server manager has been developed with the intention of playing on a private server with some friends. The server shall not be running all the time. It'll only be started, when someone actually wants to play. For avoiding SSH connections to the server and the execution of shell scripts manually, i created the server manager. All my friends can login to the web interface and can quickly see whether the server is up and running and if it is not running they can simply start and later on stop server.

Perhaps there are other usecases for it. Just let me know :)

## What's next
I've created a [Trello Board](https://trello.com/b/UeYwnWGy/ark-server-manager), where i collect new feature ideas and everyone can vote for these features to identify the most important ones.

## Technology Insight
For all the developers out there, i also want to give a short overview on what i used for the Development. Basically it is a Nodejs Express application. The REST services and websockets are secured via JWT. I used [express-jwt]() and [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for this. The SSL handling for HTTPS is done via [letsencrypt-express](https://github.com/Daplie/letsencrypt-express). [NEDB](https://github.com/louischatriot/nedb) has been used for persistence, which uses the MongoDB API, but can be run embedded in the node server.

The frontend is written with AngularJS.