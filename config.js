module.exports = {
  "port": 3000,
  "mongoose": {
    "uri": "mongodb://localhost/local",
    "options": {
      "server": {
        "socketOptions": {
          "keepAlive": 1
        }
      }
    }
  },
  session: {
    secret: "KillerIsJim",
     key: "sid",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: null
    }
  }
};