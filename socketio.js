module.exports = function (io) {
    
    let users = {}
    let socketToRoom = {}
    console.log('hey1')
    io.on('connection', socket => {
        console.log('hey')
        socket.on("join room", (roomID, dispName) => {
            socket.join(roomID)

            socket.to(roomID).emit("user-connected", dispName);
        });
    
        socket.on("sending signal", payload => {
            io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
        });
    
        socket.on("returning signal", payload => {
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        });
    
        socket.on('disconnect', () => {
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                room = room.filter(id => id !== socket.id);
                users[roomID] = room;
            }
        });

        socket.on('new-msg', (roomID) => {
            console.log('new-msg')
            socket.to(roomID).braodcast.emit('new-msg')
        })
    
    });
}