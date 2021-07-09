import React from 'react'
import { useParams } from 'react-router-dom'
const socket  = require('../connection/socket').socket




const JoinGameRoom = (gameid, userName, isCreator) => {
    
   
    const idData = {
        gameId : gameid,
        userName : userName,
        isCreator: isCreator
    }
    socket.emit("playerJoinGame", idData)
}
  
  
const JoinGame = (props) => {
   
    const { gameid } = useParams()
    JoinGameRoom(gameid, props.userName, props.isCreator)
    return <div>
        <h1 style = {{textAlign: "center"}}>Welcome to Chess with Friend!</h1>
        <h3 style = {{textAlign: "center"}}>Made with ❤️ by <a href = 'https://jackhe.codes/' target = '_blank'>Jack He</a>. Subscribe to my <a href = 'https://www.youtube.com/channel/UC9xFO-llZ2ontatfj9LtLxw' target = '_blank'>YouTube channel</a>. Follow me on <a href = 'https://www.instagram.com/jack_he_hd/?hl=en' target = '_blank'>Instagram</a>.</h3>
    </div>
}

export default JoinGame
