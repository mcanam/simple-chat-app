const express = require("express");
const http = require("node:http");
const { uid } = require("uid");
const { WebSocket } = require("ws");

const app  = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = {};

wss.on("connection", ws => {
      const id = uid();
      clients[id] = ws;

      // connection is up, let"s add a simple event
      ws.on("message", async (message) => {
            const data = JSON.parse(message.toString());

            if (data.initial) {
                  clients[id].name = data.name;
            }

            if (!data.initial) {
                  // broadcast message
                  Object.entries(clients).forEach(([_id, client]) => {
                        client.send(JSON.stringify({
                              user: {
                                    id: id,
                                    name: clients[id].name
                              },
                              me: _id == id,
                              message: data.message
                        }));
                  });
            }
      });

      ws.on("close", () => {
            delete clients[id];
      });
});

app.use(express.static("static"));

// start server >> http://localhost:3000
server.listen(port, () => {
      console.log(`Server started on port ${port}`);
});
