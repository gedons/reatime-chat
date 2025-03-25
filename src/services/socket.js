import { io } from 'socket.io-client';

const socket = io('https://realtimechat-api-cqlr.onrender.com:5000', {
  auth: { token: localStorage.getItem('token') },
  transports: ['websocket'], 
});

export default socket;
