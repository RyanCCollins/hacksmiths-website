# Hacksmiths Website

API, CMS, and backend for the Hacksmiths website

## Getting Started

This project requires NodeJS, NPM, Bower, keystone and Gulp.

Install them globally with this command.
```
npm install -g bower gulp keystone
```

To get the app running, you will need to setup the environment variables.  You will see that there is a .env_sample file.  This contains all of the needed environment variables.  These variables are needed to run this app, so if you need them, you can follow the [KeystoneJS setup guide](http://keystonejs.com/docs/configuration/) for the Cloudinary and Mandrill APIs.

You can move onto the installation section, but if you have any issues, you will want to follow these steps to update npm and use NodeJS version 4.2.4.

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

Deployed to github pages.

## Built With

* JQuery
* NodeJS
* Sublime Text
* Browsersync
* Gulp
* KeystoneJS

## Authors

* **Ryan Collins**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

*
