// Mongoose model to interact with the database.
const Room = require('./models/roomModel')

module.exports = function (io) {
    // maps rooms to users 
    let users = {}

    //maps users to rooms
    let socketToRoom = {}

    // on initial connection
    io.on('connection', socket => {

        // on join room request
        socket.on("join room", roomID => {
            // if the room is not empty -> join room 
            if (users[roomID]) {
                const length = users[roomID].length;
                if (length === 4) {
                    socket.emit("room full");
                    return;
                }
                users[roomID].push(socket.id);
            }
            // if room empty -> create room
            else {
                users[roomID] = [socket.id];
            }

            socketToRoom[socket.id] = roomID;
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
            console.log(users)
            // sends details of all OTHER users to allow client to 
            // establosh peer connections
            socket.emit("all users", usersInThisRoom);
        });

        socket.on("sending signal", payload => {
            io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
        });

        
        socket.on("returning signal", payload => {
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        });

        // on a client disconnecting
        socket.on('disconnect', () => {
            const roomID = socketToRoom[socket.id];
            console.log(socket.id)
            let room = users[roomID];
            if (room) {
                room = room.filter(id => id !== socket.id);
                users[roomID] = room

                // tell all remaining users
                room.map(user => {
                    io.to(user).emit('user-left', { userID: socket.id })
                })
            }
        });

        // on new message from a client
        socket.on('new-msg', (req) => {
            roomID = req.roomID;
            msg = req.msg;
            from = req.from;
            console.log(req)
            let usersInRoom = users[roomID];
            Room.findOne({ roomID }).then(room => {
                // room does not exist
                if (!room) {
                    socket.emit('no-room')
                    console.log('no-room')
                }
                else {
                    const new_msg = {
                        msg: msg,
                        from: from
                    }
                    room.msg_list.push(new_msg)
                    room.save();
                    // send to ALL users including sender
                    if (usersInRoom)
                        usersInRoom.map(userID => {
                            io.to(userID).emit('msg-sent', room.msg_list)
                        })
                }
            })
        })

    });
}