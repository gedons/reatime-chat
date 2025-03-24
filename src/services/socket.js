import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
  transports: ['websocket'], 
});

export default socket;
