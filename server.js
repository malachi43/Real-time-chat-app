const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const utils = require('./utils')
const PORT = process.env.PORT || 3000
const botName = 'Chat Bot'


//Set static folder
app.use(express.static(path.join(__dirname, './public')))

//Runs when client connect
io.on('connection', socket =>{
 
   socket.on('joinRoom', ({username, room})=>{

      const roomLowerCase = room.toLowerCase()

      const user = utils.saveUser(socket.id, username,  roomLowerCase)
      
      socket.join(user.room)
      
      //Welcome current user
        utils.welcomeUser(socket, utils.format({
        username: botName, 
        text: `${user.username} welcome to Let's Yarn :)`
    }))

      //Broadcast messages to users except the current user
      utils.sendMessageToAllUsersExceptCurrentConnectedUser(user,socket, utils.format({
        username:  botName, 
        text:` ${user.username} has joined the chat room`
    }))

        //send room name and number of users
        utils.sendRoomUsersAndRoomName(io, {room: user.room, 
        users: utils.getRoomUsers(user.room)
    })
    
      //Listen for chatMessage
      socket.on('chatMessage', ({msg}) =>{

        const currentUser = utils.getCurrentUser(socket.id)

       //Broadcast messages to all users
       utils.sendMessageToAllUsers(currentUser,io, utils.format({
        username:  `${currentUser.username}`, 
        text: msg}))
    
      })

        

     //Runs when clients disconnects
   socket.on('disconnect', ()=>{
    //get disconnected user
    const disconnectedUser = utils.userLeavesChat(socket.id)
    
    //Broadcast messages to users when a user leaves the chat room
    utils.sendMessageToAllUsers(disconnectedUser,io, utils.format({
    username: botName, 
    text:` ${disconnectedUser.username} left the chat room`
}))

    //send room name and number of users
    utils.sendRoomUsersAndRoomName(io, {room: user.room, 
    users: utils.getRoomUsers(user.room)
})

 })
   })


})

server.listen(PORT , ()=> console.log(`Server running on port ${PORT}`))
