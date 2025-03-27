import { io } from 'socket.io-client';

const socket = io('https://realtimechat-api-cqlr.onrender.com', {
  auth: { token: localStorage.getItem('token') },
  transports: ['websocket'], 
});

export default socket;


//https://realtimechat-api-cqlr.onrender.com
