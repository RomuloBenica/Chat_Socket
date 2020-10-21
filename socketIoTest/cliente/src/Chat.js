import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import uuid from "uuid/dist/v4";

const myId = uuid();
const socket = io('http://localhost:3002');
socket.on('connect', () => console.log('[IO] Connect => New connection'));

function Chat() {

  const [message, setMessage ] = useState(''); 
  const [messages, setMessages ] = useState([]); 

  useEffect(() => {
    const handleNewMessage = newMessage => {
      setMessages([ ...messages, newMessage]);
    }
    socket.on('chat.message', handleNewMessage);
    return () => socket.off('chat.message', handleNewMessage)
  }, [messages]);

  const handleInputChange = event => {
    setMessage(event.target.value)
  }

  const handleFormSubmit = event => {
    event.preventDefault(); //"para nao recarregar a pagina"
    if(message.trim()){//limpar campo do  input "no if vazio == falso"
      socket.emit('chat.message', {
        id: myId,
        message: message
      })
      console.log("console menssages"+ messages);
      setMessage('');
    }
  }

  return(
    <main className="container">
      <ul className="list">
        { messages.map((m, index) => (
          <li key={index} className={`list__item list__item--${m.id === myId ? 'mine' : 'other'}`}>
            <span  className={`message message--${m.id === myId ? 'mine' : 'other'}`}>
             {m.message}
            </span>
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={handleFormSubmit}>
        <input 
          className="form__field"
          placeholder="type a new message here"
          type="text"
          value={message}
          onChange={handleInputChange}
        />
      </form>
    </main>
  )
}

export default Chat;