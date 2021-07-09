const express = require("express");
const router = express.Router();

// Room Mongoose model for database interaction
const Room = require('./models/roomModel')

// test
// @route POST /
// @desc To check if backend is running
// @access Public
router.get('/', (req, res) => {
  res.json({ msg: 'running' });
})

// user joining room
// @route POST /joinRoom
// @desc allows user to join room, takes rooID as input
// @access Public
router.post('/joinRoom', (req, res) => {
  roomID = req.body.roomID
  console.log({ roomID }, 'routes.js')
  Room.findOne({ roomID }).then(roomOB => {
    //check if room exists in database 
    if (!roomOB) {
      console.log('room not exist');
      return res.json({ room_exists: false })
    }
    console.log(roomOB)
    return res.json({ room_exists: true, roomID: roomOB.roomID })
  }).catch(err => {
    console.log(err);
    return res.json({ room_exists: false })
  })
})

// user create room
// @route POST /CreateRoom
// @desc allows user to create room, takes rooID as input
// @access Public
router.post('/CreateRoom', (req, res) => {
  roomID = req.body.roomID
  Room.findOne({ roomID }).then(roomOB => {
    //checks if room exists prior to creation
    if (roomOB) {
      console.log('room already exists');
      return res.json({ room_exists: true })
    }
    newRoom = new Room({
      roomID: roomID,
    })
    newRoom.save().then(room => {
      console.log(newRoom)
    })

    console.log(roomOB)
    return res.json({ room_exists: true, roomID: roomOB.roomID })
  }).catch(err => {
    console.log(err);
    return res.status(500).json({ err: err })
  })
})

// send message from user to room 
// @route POST /sendMsg
// @desc allows user to join room, takes rooID as input
// @access Public
router.post('/sendMsg', (req, res) => {
  console.log(req.body);
  const msg = req.body.msg, from = req.body.from, roomID = req.body.roomID;
  Room.findOne({ roomID }).then(room => {
    if (!room) {
      return res.status(500).json({ error: 'room does not exist' })
    }
    const new_msg = {
      msg: msg, 
      from : from
    }

    // save room.msg_list with new message from user
    room.msg_list.push(new_msg)
    room.save();

    return res.status(200).json({msg: 'done'})
  })
})

// request for messages from user 
// @route POST /getMsg
// @desc Sends messages from server to client
// @access Public
router.post('/getMsg', (req, res) => {
  console.log(req.body);
  const roomID = req.body.roomID;
  Room.findOne({roomID}).then(room => {
    if (!room) {
      return res.status(500).json({error: 'room does not exist'})
    }
    return res.status(200).json({msg_list: room.msg_list})
  })
})

module.exports = router;