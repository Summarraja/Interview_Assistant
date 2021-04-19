const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
const username = require('username-generator')
const port = process.env.PORT || 5000

const usersRoutes = require('./routes/users-routes');
const interviewsRoutes = require('./routes/interviews-routes');
const fieldsRoutes = require('./routes/fields-routes');
const skillsRoutes = require('./routes/skills-routes');
const resumesRoutes = require('./routes/resumes-routes');
const certificatesRoutes = require('./routes/certificates-routes');
const settingsRoutes = require('./routes/settings-routes')
const faqsRoutes = require('./routes/faqs-routes');
const chatsRoutes = require('./routes/chats-routes');
const messagesRoutes = require('./routes/messages-routes');
const HttpError = require('./models/http-error');

const users = {}

io.on('connection', (socket) => {
  //generate username against a socket connection and store it
  let userid = socket.request._query['id'];
  //send back username
  console.log("connected")

  if (!users[userid]) {
    users[userid] = [socket.id]
  } else {
    users[userid].push(socket.id)
  }
  console.log(users)

  socket.on('client', (data) => {
    userid = data.id;

  })
  socket.on('disconnect', () => {
    console.log("disconnected")
    const index = users[userid].indexOf(socket.id);
    if (index > -1) {
      let newArray = users[userid].filter(item => item != socket.id);
      if (newArray.length == 0)
        delete users[userid];
      else
        users[userid] = newArray;
    }
    console.log(users)
  })

  socket.on('message', (msg) => {
    axios.post('http://localhost:5000/api/messages/',
      msg, {
      headers: {
        'Authorization':msg.token
      }
    })
      .then(function (response) {
        console.log(response.status);
        if(users[msg.receiver]){
          users[msg.receiver].forEach(soc => {
            io.to(soc).emit('message', msg)
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  })

  socket.on('callUser', (data) => {
    io.to(users[data.userToCall]).emit('hey', { signal: data.signalData, from: data.from })
  })

  socket.on('acceptCall', (data) => {
    io.to(users[data.to]).emit('callAccepted', data.signal)
  })

  socket.on('close', (data) => {
    io.to(users[data.to]).emit('close')
  })

  socket.on('rejected', (data) => {
    io.to(users[data.to]).emit('rejected')
  })
})


app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/users', usersRoutes);
app.use('/api/interviews', interviewsRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/messages', messagesRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
    // `mongodb://localhost:27017/smarthireDB`
    `mongodb+srv://Summar:H4NUsZcxzxv0fonF@cluster0.uzdlx.mongodb.net/mern?retryWrites=true&w=majority`

    , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    server.listen(port);
    console.log("Connected to Database:")
  })
  .catch(err => {
    console.log(err);
  });
