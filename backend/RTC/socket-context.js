const socket = require("socket.io-client").connect(process.env.LOCALHOST+':'+process.env.PORT+'',{ query: "id=" + 0 });
module.exports = socket;