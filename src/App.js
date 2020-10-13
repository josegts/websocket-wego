import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null)
  const [message,setMessage] = useState(null)

  useEffect(()=>{
    
  },[])

  const connectWegoSocket = () => {
    var Stomp = require("@stomp/stompjs");
    var SockJS = require("sockjs-client");
    var socket = new SockJS("http://localhost:5000/wego-test-websocket");
    setStompClient(()=>{
      let stompClientt = Stomp.Stomp.over(socket);
      stompClientt.connect({}, function (frame) {
        setConnected(true);
        console.log("Connected: " + frame);
        stompClientt.subscribe("/test/message", function (message) {
          console.log("Suscribiendose al test de mensajes", message);
          showTest(JSON.parse(message.body));
        });
      });
      return stompClientt;
    });
    
  }

  const onConnected = () => {
    connectWegoSocket();
  }

  const onDisconnect = () => {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
    setConnected(false);
  }
  const onSend = ()=>{
    stompClient.send("/app/message",{},JSON.stringify({ message }));
  }

  const showTest = (message) => {
    setMessages((ms) => [...ms, message]);
  }

  const onChangeMessage = (ev) =>{
    console.log(ev.target.value);
    setMessage(ev.target.value)
  }

  return (
    <div className='App'>
      <section>
        <hr />
        <button onClick={onConnected} disabled={connected}>
          conectar
        </button>
        <button onClick={onDisconnect}>desconectar</button>
        <hr />
        {connected ? (
          <h1 className='blue'>Conectado al socket de WeGo</h1>
        ) : (
          <h1 className='red'>Desconectado</h1>
        )}
        <h2>Test Socket</h2>
        <input onChange={(e) => onChangeMessage(e)} value={message} />
        <button onClick={onSend}>Enviar</button>
        <hr />
        <h3>Mensajes del servidor</h3>
        <div className='msg'>
          {messages &&
            messages.map((m, i) => (
              <span key={i} class='item'>
                <strong>{m.message}</strong>
                <span>{new Date(m.date).toString()}</span>
              </span>
            ))}
        </div>
      </section>
    </div>
  );
}

export default App;
