require("./settings.js")
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require("axios")
const { getBuffer, fetchJson } = require('./function.js')  
const { stalk } = require("node-tiklydown")
const { setTimeout: sleep } = require('timers/promises');
const fetch = require("node-fetch")
const scp = require("caliph-api")
const scp2 = require("imon-videos-downloader")

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "function")));
app.use(bodyParser.raw({ limit: '50mb', type: '*/*' }))

app.get("/api/imagecreator/qc", async (req, res) => {
    try {     
      const { text, fotoUrl, nama } = req.query
      if (!text || !nama || !fotoUrl) return res.json("Isi Parameternya!");
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#000000",
  "width": 812,
  "height": 968,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": nama,
        "photo": {
          "url": fotoUrl
        }
      },
      "text": text,
      "replyMessage": {}
    }
  ]
};
        const response = axios.post('https://bot.lyo.su/quote/generate', json, {
        headers: {'Content-Type': 'application/json'}
}).then(async (res) => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
  return buffer
})
      if (!response) res.json("Error!")
      await res.set("Content-Type", "image/png")
      await res.send(response)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Error");
});


app.use((req, res, next) => {
res.send("Hello World :)")
});


app.listen(PORT, () => {
  console.log(`Server Telah Berjalan > http://localhost:${PORT}`)
})



