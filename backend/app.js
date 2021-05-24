const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
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
const notificationsRoutes = require('./routes/notifications-routes');
const HttpError = require('./models/http-error');
const socketHandler = require('./RTC/socket-handler');

const users = {}
io.on('connection', (socket) => socketHandler(users, socket, io));

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
app.use('/api/notifications', notificationsRoutes);

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
  res.status(error.status || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
    // `mongodb://localhost:27017/smarthireDB`
    `mongodb+srv://Summar:H4NUsZcxzxv0fonF@cluster0.uzdlx.mongodb.net/mern?retryWrites=true&w=majority`
    , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    server.listen(port);
    console.log("Connected to Database:")
  })
  .catch(err => {
    console.log(err);
  });