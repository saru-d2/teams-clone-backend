const express = require('express')
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const PORT = process.env.PORT || 4000
//socketio
const io = require("socket.io")(server, {
        cors: {
                origin: "*",
                methods: ["GET", "POST"],
    },
})

require('./socketio')(io)
 

// mongoose
const mongoose = require('mongoose');
MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/'
MONGO_DB = 'teams-clone'
mongoose.connect(MONGO_URL + MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => console.log('connected to mongoDB')).catch(err => console.log('err'));
mongoose.connection.once('open', () => console.log('connected'))
    .on('error', (error) => {
        console.log("mongodb failed to connect :'(");
        console.log(error);
    });
// -- 

//TODO remove debug flag

const routes = require('./routes');

app.use('/', routes)

//TODO move socketio code to its own file // done

server.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
});