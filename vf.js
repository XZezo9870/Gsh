const express = require('express');
const axios = require('axios');
const gamedig = require('gamedig');

const app = express();
const port = 3000;

// Endpoint untuk mengambil informasi server FiveM menggunakan GameDig
app.get('/api/fivem', async (req, res) => {
  try {
    const serverIP = req.query.ip;
    const serverPort = req.query.port;

    const gameDigQuery = gamedig.query({
      type: 'fivem',
      host: serverIP,
      port: serverPort
    });

    const serverInfoResponse = axios.get(`http://${serverIP}:${serverPort}/info.json`);

    const [gameDigResult, serverInfoResult] = await Promise.all([gameDigQuery, serverInfoResponse]);

    const serverStatus = {
      online: true,
      ping: gameDigResult.ping,
      hostname: gameDigResult.raw.hostname,
      players: gameDigResult.players.length,
      maxPlayers: gameDigResult.maxplayers,
      map: gameDigResult.map,
      gameName: gameDigResult.raw.gamename,
      password: gameDigResult.password ? true : false,
      version: gameDigResult.raw.iv,
      banner: serverInfoResult.data.vars.banner_detail,
    };

    res.json(serverStatus);
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    res.status(500).json({ error: 'Gagal mengambil informasi server' });
  }
});

// Jalankan server API
app.listen(port, () => {
  console.log(`Server API berjalan di http://localhost:${port}`);
});
