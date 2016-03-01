FROM ubuntu:latest

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list

RUN apt-get update
RUN apt-get install -y mongodb-org git python build-essential curl
RUN service mongod start

RUN mkdir -p /data/db

RUN mkdir /Development
RUN cd /Development && git clone git://github.com/joyent/node

RUN cd /Development/node && ./configure && make && make install
RUN rm -rf /Development/node
RUN chmod 777 -R /Development

RUN npm install -g yo bower keystone gulp
# Manually trigger the bower install with allow-root options
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN bower install --config.interactive=false

# Set development environment as default
ENV NODE_ENV development


# RUN curl https://j.mp/spf13-vim3 -L > spf13-vim.sh && sh spf13-vim.sh

EXPOSE 80:80
EXPOSE 443:443
EXPOSE 3000:3000
# Port 4000 for server
# Port 35729 for livereload
EXPOSE 4000 35729


RUN echo "\n##############################\n1. Create a new user with adduser, 'su' into that user.\n2. 'yo meanjs' to scaffold your app in the current directory.\n3. Start mongo in the background (e.g. 'mongod &')\n##############################\n"
CMD ["forever start gulp"]