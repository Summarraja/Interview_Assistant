const fs = require('fs');
const path = require('path');
var FormData = require('form-data');

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
const ProblemRoutes = require('./routes/ReportProblem-routes');
const chatsRoutes = require('./routes/chats-routes');
const messagesRoutes = require('./routes/messages-routes');
const HttpError = require('./models/http-error');

const users = {}

io.on('connection', (socket) => {
  let userid = socket.request._query['id'];
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

  socket.on('message', (data) => {
    let msgdata = new FormData();
    msgdata.append('sender', data.message.sender);
    msgdata.append('receiver', data.message.receiver);
    msgdata.append('content', data.message.content);
    msgdata.append('time', data.message.time);
    msgdata.append('isRead', 'true');
    msgdata.append('chat', data.message.chat);
    msgdata.append('image', data.file, { filename: data.fileName });
    axios.post('http://localhost:5000/api/messages/',
      msgdata, {
      headers: {
        ...msgdata.getHeaders(),
        'Authorization': data.token
      }
    })
      .then(function (response) {
        console.log(response.status);
        if (users[data.message.receiver]) {
          users[data.message.receiver].forEach(soc => {
            io.to(soc).emit('message', response.data.Message)
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  })
  socket.on('deleteMessage', (data) => {
    axios.patch('http://localhost:5000/api/messages/' + data.msg.id,
      null, {
      headers: {
        'Authorization': data.token
      }
    })
      .then(function (response) {
        console.log(response.status);
        if (users[data.msg.receiver]) {
          users[data.msg.receiver].forEach(soc => {
            io.to(soc).emit('deleteMessage', data.msg)
            console.log("emitted")
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  })
  socket.on('callUser', (data) => {
    if (users[data.userToCall]) {
      users[data.userToCall].forEach(soc => {
        io.to(soc).emit('hey', { signal: data.signalData, fromId: data.fromId, fromName: data.fromName, fromImage:data.fromImage })
      });
    }
  })
  socket.on('acceptCall', (data) => {
    if (users[data.to]) {
      users[data.to].forEach(soc => {
        io.to(soc).emit('callAccepted', data.signal)
      });
    }
  })

  socket.on('close', (data) => {
    if (users[data.to]) {
      users[data.to].forEach(soc => {
        io.to(soc).emit('close')
      });
    }
  })

  socket.on('rejected', (data) => {
    if (users[data.to]) {
      users[data.to].forEach(soc => {
        io.to(soc).emit('rejected')
      });
    }
  })

  socket.on('busy', (data) => {
    if (users[data.to]) {
      users[data.to].forEach(soc => {
        io.to(soc).emit('busy')
      });
    }
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
app.use('/api/problems', ProblemRoutes); 
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