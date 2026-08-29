import dgram from "node:dgram";

const socket = dgram.createSocket("udp4");

socket.on("message", (msg, rinfo) => {
  console.log(`Server received ${msg} from ${rinfo.address}:${rinfo.port}`);
});

socket.bind(8000, "127.0.0.1", () => console.log("UDP connection listening on http://127.0.0.1:8000"));
