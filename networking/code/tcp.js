import net from "node:net";

const server = net.createServer((socket) => {
  socket.write("Hello");

  socket.on("data", (data) => console.log("Received data", data.toString()));
});

server.listen(8000, () => console.log("TCP connection listening on http://127.0.0.1:8000"));
