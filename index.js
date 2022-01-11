// require your server and launch it here
const server = require("./api/server.js");

const Port = 5000;

server.listen(Port, () => {
    console.log(`Listening on localhost:${Port}`);
})