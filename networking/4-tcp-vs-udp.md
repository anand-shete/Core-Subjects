# Transmission Control Protocol

Transmission Control Protocol (TCP) is a core communication standard that ensures data is delivered reliably, accurately, and in the correct order across a network. It operates at the Transport Layer (Layer 4) of the Open Systems Interconnection (OSI) model.

- Error detection using checksums
- Manages transmission speed using Sliding Window mechanism
- Header size is minimum `20 bytes`

## Three Way Handshake

Before sending data, TCP uses a three-step process:

1. **SYN (Synchronize)**: The client sends a synchronization packet to the server to request a connection.
2. **SYN-ACK (Synchronize-Acknowledgment)**: The server responds, acknowledging the request and agreeing to connect.
3. **ACK (Acknowledgment)**: The client acknowledges the server's response, establishing a secure, stable connection.

## Uses of TCP

TCP is used anywhere data loss or scrambling cannot be tolerated.

**Web Browsing**: Powers HTTP/HTTPS to load full web pages without missing layouts or missing graphics.
**File Transfers**: Drives protocols like FTP and SFTP to make sure files don't become corrupted during download.
**Email Protocols**: Utilized by SMTP, IMAP, and POP3 to keep text and attachments perfectly intact.
**Remote Login**: Used by SSH and Telnet to ensure keystrokes arrive sequentially and securely at remote servers.

## Four Step Teardown

The Four-Step Handshake (or connection termination) is used to gracefully close a TCP connection, ensuring that both devices have finished sending all data before the connection is completely shut down. Because TCP is a full-duplex protocol, each direction of the connection must be closed independently.

1. **Finish (FIN)**: The client sends a packet with the FIN (Finish) flag set, signaling it has no more data to send.
2. **Acknowledgment (ACK)**: The server receives the FIN packet and responds with an ACK packet, confirming receipt.
3. **Finish (FIN)**: After finishing its own data transmission, the server sends its own FIN packet to the client.
4. **Acknowledgment (ACK)**: The client receives the server's FIN packet and responds with a final ACK packet.

# User Datagram Protocol

User Datagram Protocol (UDP) is a lightweight communication standard that sends data across a network quickly without checking for errors or verifying delivery. It operates at the Transport Layer (Layer 4) of the network model but prioritizes speed and efficiency over absolute reliability, making it ideal for real-time applications.

- Does not eastablish formal connection to destination IP before sending data
- Does not track whether data packets (datagrams) reach destination
- Header size is `8 bytes`

## Uses of UDP

UDP is used whenever a continuous stream of data is more important than a perfectly complete one:

**Live Video Streaming**: A lost packet might cause a brief, split-second glitch on your screen, but the video keeps playing smoothly without pausing to wait for the missing frame.
**Online Gaming**: Multiplayer games rely on UDP for real-time positioning. If a packet is delayed, the game simply drops it and waits for the next update, preventing gameplay lag.
**Voice over IP (VoIP)**: Powers internet phone calls and video chats (like Zoom or Skype). Missing data results in minor audio static rather than a frozen, delayed conversation. **WebRTC uses UDP** protocol.
**Domain Name System (DNS)**: When your browser looks up a website's IP address, it uses UDP because DNS requests are small, single-packet queries that require instant answers.

## TCP vs UDP

| Feature     | Transmission Control Protocol                              | User Datagram Protocol                                      |
| ----------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| Connection  | Requires a formal handshake before sending data.           | Sends data immediately without establishing a connection.   |
| Reliability | Guarantees data delivery and will retransmit lost packets. | Does not guarantee delivery; lost packets are gone forever. |
| Order       | Delivers data in the exact order it was sent.              | Packets can arrive out of order or mixed up.                |
| Speed       | Slower due to error-checking and handshake overhead.       | Faster because it has virtually no overhead.                |
| Header Size | Large header (`20` to `60` bytes).                         | Lightweight header (exactly `8` bytes).                     |
| Data Flow   | Manages data flow to avoid overwhelming the receiver.      | Sends data continuously regardless of receiver capacity.    |
