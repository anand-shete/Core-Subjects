## Types of Protocols

### Client-Server Protocols

1. **HTTP** (Hypertext Transfer Protocol): Stateless request-response protocol for web traffic. HTTP/1.1 and HTTP/2 run on TCP; HTTP/3 runs on QUIC (UDP).

2. **FTP** (File Transfer Protocol): Dual-channel file transfer. Uses Port 21 for command/control and Port 20 for actual data transfer.

3. **SMTP** (Simple Mail Transfer Protocol): Used exclusively for sending and relaying mail. (User Agent → MTA Client → MTA Server → Target Mailbox Server).

4. **IMAP** (Internet Message Access Protocol): Used for retrieving and managing mail. Keeps mail synced on the server across multiple devices.

5. **POP3** (Post Office Protocol v3): Alternative retrieval protocol. Downloads mail to a single local device and deletes it from the server.

6. **Websockets**: State-upgraded protocol. Starts as a standard HTTP handshake but upgrades to a persistent, bi-directional, full-duplex TCP connection.

### P2P Protocols

1. **WebRTC**: Browser-based, ultra-low latency audio/video streaming. Uses Signaling (via WebSockets/HTTP) to exchange metadata via STUN/TURN servers, then establishes a direct P2P UDP connection.

2. **BitTorrent**: Distributed file sharing protocol. Uses a decentralized tracker system to allow peers to download file pieces simultaneously from multiple sources.

3. **Gossip Protocols**: Decentralized communication where nodes periodically pass state updates to random neighbors. Used for state synchronization in blockchains (Bitcoin) and distributed databases (Cassandra).

### Pub/Sub Protocols (Publish/Subscribe)

1. **MQTT** (Message Queuing Telemetry Transport): Ultra-lightweight protocol used by smart home devices and sensors.

2. **AMQP** (Advanced Message Queuing Protocol): Robust, enterprise protocol used by message brokers like RabbitMQ.

### RPC Protocols (Remote Procedure Call)

1. **gRPC**: Developed by Google, it uses HTTP/2 and Protocol Buffers to send binary data at extreme speeds between microservices.

### Low-Level Transport Protocols (Layer 4)

1. **TCP** (Transmission Control Protocol): Connection-oriented, guarantees delivery, tracks data packets (used by HTTP, SMTP).

2. **UDP** (User Datagram Protocol): Connectionless, fast, fire-and-forget, drops packets if needed (used by video streaming, gaming, and your mentioned WebRTC).

3. **QUIC**: A modern UDP-based protocol designed by Google that powers HTTP/3 to make mobile web browsing faster.
