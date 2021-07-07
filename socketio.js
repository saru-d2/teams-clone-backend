module.exports = function (io) {

    let users = {}
    let socketToRoom = {}
    console.log('hey1')

    io.on('connection', socket => {
        socket.on("join room", roomID => {
            if (users[roomID]) {
                const length = users[roomID].length;
                if (length === 4) {
                    socket.emit("room full");
                    return;
                }
                users[roomID].push(socket.id);
            } else {
                users[roomID] = [socket.id];
            }
            socketToRoom[socket.id] = roomID;
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
            console.log(users)
            socket.emit("all users", usersInThisRoom);
        });

        socket.on("sending signal", payload => {
            io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
        });

        socket.on("returning signal", payload => {
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        });

        socket.on('disconnect', () => {
            const roomID = socketToRoom[socket.id];
            console.log(socket.id)
            let room = users[roomID];
            if (room) {
                room = room.filter(id => id !== socket.id);
                users[roomID] = room
                
                room.map(user => {
                    io.to(user).emit('user-left', {userID: socket.id})
                })
            }
        });

        socket.on('new-msg', (roomID) => {
            console.log('new-msg from ', roomID)
            let room = users[roomID];
            console.log(room)
            if(room) {
                room.map(user => {
                    io.to(user).emit('msg-sent')
                })
            }
        })

    });
}