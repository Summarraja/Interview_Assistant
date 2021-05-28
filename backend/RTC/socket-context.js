const socket = require("socket.io-client").connect('http://localhost:5000',{ query: "id=" + 0 });
module.exports = socket;