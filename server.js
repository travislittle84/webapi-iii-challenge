const express = require('express')

const UserRouter = require('./users/userRouter.js')

const server = express();

const bodyParser = express.json()

server.use(express.json())

server.use('/api/users', UserRouter)

server.use(bodyParser)
server.use(logger)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const datetime = new Date()  
  console.log(`${datetime.toISOString()} REQUEST: ${req.method}`)
  next()
};

module.exports = server;
