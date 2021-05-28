var FormData = require('form-data');
const axios = require('axios');

const socketHandler = (users, socket,io) => {

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
    socket.on('message', (data,callback) => {
        let msgdata = new FormData();
        msgdata.append('sender', data.message.sender);
        msgdata.append('receiver', data.message.receiver);
        msgdata.append('content', data.message.content);
        msgdata.append('image', data.file, { filename: data.fileName });
        axios.post('http://localhost:5000/api/messages/',
            msgdata, {
            headers: {
                ...msgdata.getHeaders(),
                'Authorization': data.token
            }
        })
            .then(function (response) {
                callback(false, true);
                console.log(response.status);
                if (users[data.message.receiver]) {
                    users[data.message.receiver].forEach(soc => {
                        io.to(soc).emit('message', response.data.Message)
                    });
                }
            })
            .catch(function (error) {
                callback(true, false);
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
                io.to(soc).emit('hey', { signal: data.signalData, fromId: data.fromId, fromName: data.fromName, fromImage: data.fromImage ,type:data.type})
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
    socket.on('notification', (data) => {
        console.log(data)
        if (users[data.userId]) {
            users[data.userId].forEach(soc => {
                io.to(soc).emit('notification',data.notification);
            });
        }
    })

}
module.exports = socketHandler;