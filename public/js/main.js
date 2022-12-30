//socket.io
const socket = io()

//get message from user
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const userLists = document.querySelector('#users')
const roomName = document.querySelector('#room-name')


//get username and room from url
const query = Qs.parse(location.search, { 
    ignoreQueryPrefix: true
})

const username = query['?username']
const room = (query['room'])

//join a room
joinRoom({username, room})

//receive message from user
receiveMessage()
renderRoomNameAndUsers()

chatForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    //get text from user
    const msg = e.target.elements.msg.value

    //clear text field after chat(text) is sent
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
    
    //Send message to server
    sendChat({msg})
})


//send chat to server
function sendChat({ msg }){
    socket.emit('chatMessage', { msg })
}


//get message from server
function receiveMessage(){
    
    socket.on('message', msg =>{
        const {username, text, time} = msg
        renderMessage({username, text, time})
    })
}


function joinRoom({username, room}){
    socket.emit('joinRoom', {username, room})
}


//render message
function renderMessage({username, text, time}){

  const div = document.createElement('div')
  
   //add class of "message" to div
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
  <p class="text">
      ${text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
}


//add room name and users to DOM
function renderRoomNameAndUsers(){
    socket.on('roomAndUsers', ({room, users})=>{
      renderUsers(users)
      renderRoomName(room)
    })
}

//add room name to DOM
function renderRoomName(room){
   roomName.innerHTML = `<h1>${room}</h1>`
}

//add users to DOM
function renderUsers(users){
    const roomUsers = users.map(user => `<li>${user.username}</li>`).join('')
    userLists.innerHTML = roomUsers
}