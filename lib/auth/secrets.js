module.exports = {
  db: process.env.MONGO_URI,
  sessionSecret: process.env.SESSION_SECRET,
  tokenSecret: process.env.TOKEN_SECRET,

  github: {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: '/auth/github?cb',
    passReqToCallback: true
  },

  mandrill: {
    API_KEY: process.env.MANDRILL_API_KEY,
    user: process.env.MANDRILL_USER,
    password: process.env.MANDRILL_PASSWORD
  },

  cloudinary: {
    uri: process.env.CLOUDINARY_URL,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
  },
  twitter: {
    clientID: process.env.TWITTER_ID,
    clientSecret: process.env.TWITTER_SECRET,
    callbackURL: '/auth/twitter?cb',
    passReqToCallback: true
  }
}
