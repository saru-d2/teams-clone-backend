const express = require("express");
const router = express.Router();
const Room = require('./models/roomModel')
const uuid = require('uuid').v4


router.get('/', (req, res) => {
  res.json({ msg: 'running' });
})

router.post('/joinRoom', (req, res) => {
  // TODO check if room exists //done
  roomID = req.body.roomID
  console.log({ roomID }, 'routes.js')
  Room.findOne({ roomID }).then(roomOB => {
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

router.post('/CreateRoom', (req, res) => {
  roomID = req.body.roomID
  Room.findOne({ roomID }).then(roomOB => {
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
    return res.json({ err: err })
  })
})

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
    room.msg_list.push(new_msg)
    room.save();

    return res.status(200).json({msg: 'done'})
  })
})

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