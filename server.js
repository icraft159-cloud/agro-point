const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Entrega as páginas HTML
app.get('/',      (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/placar',(req, res) => res.sendFile(path.join(__dirname, 'placar.html')));

let currentRanking = [];
let currentLiveTimer = { name: '', time: '00:00.00', isRunning: false };

io.on('connection', (socket) => {
  console.log('✅ Cliente conectado');
  socket.emit('syncState', { ranking: currentRanking, live: currentLiveTimer });

  socket.on('updateRanking', (data) => {
    currentRanking = data;
    io.emit('rankingUpdated', currentRanking);
  });

  socket.on('clearRanking', () => {
    currentRanking = [];
    io.emit('rankingCleared');
  });

  socket.on('liveTimerUpdate', (data) => {
    currentLiveTimer = data;
    io.emit('liveTimerUpdated', currentLiveTimer);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`   Admin:  http://localhost:${PORT}/admin`);
  console.log(`   Placar: http://SEU_IP:${PORT}/placar`);
});