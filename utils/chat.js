

function sendRoomUsersAndRoomName(socket, {room, users}){
    socket.to(room).emit('roomAndUsers', {room, users})
}

function welcomeUser(socket, message){
    socket.emit('message', message)   
}


function sendMessageToAllUsers(user,io, message){
    
    io.to(user.room).emit('message', message)
}


function sendMessageToAllUsersExceptCurrentConnectedUser(user,socket, message){
    socket.to(user.room).emit('message', message)
}


module.exports = {
    welcomeUser,
    sendMessageToAllUsers,
    sendMessageToAllUsersExceptCurrentConnectedUser,
    sendRoomUsersAndRoomName
}