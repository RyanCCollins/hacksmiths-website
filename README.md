![Hacksmiths Logo](https://rawgit.com/teamhacksmiths/food-drivr-backend/master/.github/assets/hacksmiths-logo.png)

# Hacksmiths Website and API

API, CMS, and backend for the Hacksmiths.io website

## Getting Started

This project requires NodeJS, NPM, Bower, keystone and Gulp.

Install them globally with this command.
```
npm install -g bower gulp keystone
```

To get the app running, you will need to setup the environment variables.  You will see that there is a .env_sample file.  This contains all of the needed environment variables.  These variables are needed to run this app, so if you need them, you can follow the [KeystoneJS setup guide](http://keystonejs.com/docs/configuration/) for the Cloudinary and Mandrill APIs.

### Installing

To run with Gulp / Browsersync, you will want to run the setup script.
Run the following to install dependencies:
```
npm run setup
```

Then to start the server and view the page:
```
gulp
```
Which should open up your browser automatically.  If for some reason it does not, you can navigate to http://localhost:3000 to see the site.


## Deployment

Deployment is similiar to setup, except that this app can run inside of its docker container.

To do so, install Docker Compose and run the following from within the root directory of the project.
```docker-compose up ```

This will build the database and the app container and then network the two together.  If you run into any issues, I recommend installing the app without Docker un Ubuntu.  You can follow the instructions in the Dockerfile.

You will want to set the NodeJS Environment to production by running the following.  This will disable development features, such as browsersync.
```
export NODE_ENV=production
```

In production, it's a good idea to run nginx seperately from within a separate Docker container.  A sample nginx.conf file is included with the repo.  

## Built With

* NodeJS
* Bower
* Docker
* Gulp
* KeystoneJS

## Authors

* **Ryan Collins**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.  

## Acknowledgments
Many thanks to the awesome team behind KeystoneJS!  Their wonderful CMS and other open source software was inspiration for this site.

## Troubleshooting
If you have any issues getting setup, there are a few things that you can try.First of all, the app will not run without environment variables.  Follow the steps above in the "Environment Variable Setup" section.

Also, it is always a good idea to get yourself updated to the right versions of npm and NodeJS.  You will want to follow these steps to update npm and use NodeJS version 4.2.4.

Update NPM version with the following command
```
npm update -g npm
```

Use Node Version Manager (NVM) to install any version of NodeJS.
To download NVM, run this from your terminal.
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash
```
After the script installs, it will tell you that you need to reboot your terminal.  To get around this and activate the NVM install, run the following command
```
. ~/.nvm/nvm.sh
```

To use a specific NodeJS version, you need to have nvm install the correct version and then you need to tell nvm to use the right version.  Try the commands below
```
nvm install 4.2.4
nvm use 4.2.4
```

### Screenshots
![Dashboard]https://raw.githubusercontent.com/RyanCCollins/hacksmiths-website/master/Screen%20Shot%202016-06-03%20at%203.53.53%20PM.png)
![Landing Page](http://postimg.org/image/csuo6kd5n/)
