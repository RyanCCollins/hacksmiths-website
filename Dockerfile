FROM node:4.2.4

RUN mkdir -p /usr/opt/app

# Install gem sass for  grunt-contrib-sass
RUN apt-get update -qq && apt-get install -y build-essential
RUN apt-get install -y ruby
RUN gem install sass

WORKDIR /home/mean

# Install all of the global packages
RUN npm install -g keystone gulp bower

# Add a user named node
RUN groupadd -r node \
&&  useradd -r -m -g node node

COPY . /usr/opt/app

RUN chown -R node:node /usr/opt/app

# Install Mean.JS packages
RUN npm install

# Manually trigger the bower install with allow-root options
RUN bower install --config.interactive=false --allow-root

# Set development environment as default
ENV NODE_ENV development

# Port 4000 for server
# Port 35729 for livereload
EXPOSE 4000 3000 35729
CMD ["gulp"]
