## OSI Model

The Open Systems Interconnection Model is a conceptual framework created by the International Organization for Standardization (ISO) that standardizes how computer systems communicate over a network. It breaks down network communication into seven distinct layers.

> When data is sent, it moves from Layer 7 down to Layer 1 on the sender's device, and then from Layer 1 up to Layer 7 on the receiving device.

## The 7 Layers of the OSI Model

A popular mnemonic to remember the layers from top to bottom (Layer 7 to Layer 1) is **All People Seem To Need Data Processing**

| Layer Number | Layer Name   | Data Unit (PDU)    | Primary Function                                              | Common Examples / Protocols                         |
| ------------ | ------------ | ------------------ | ------------------------------------------------------------- | --------------------------------------------------- |
| Layer 7      | Application  | Data               | Direct user interface and network service interaction.        | HTTP, HTTPS, FTP, SMTP, DNS                         |
| Layer 6      | Presentation | Data               | Data formatting, encryption, and compression.                 | SSL/TLS, JPEG, ASCII, MPEG                          |
| Layer 5      | Session      | Data               | Managing and synchronizing communication sessions.            | NetBIOS, RPC, SOCKS                                 |
| Layer 4      | Transport    | Segment / Datagram | End-to-end reliability, segmenting, and flow control.         | TCP, UDP                                            |
| Layer 3      | Network      | Packet             | Routing data across different networks via logical paths.     | IPv4, IPv6, ICMP, Routers                           |
| Layer 2      | Data Link    | Frame              | Node-to-node physical data transfer and error checking.       | Ethernet, Wi-Fi, MAC addresses, Switches            |
| Layer 1      | Physical     | Bits               | Transmitting raw, unstructured electrical or optical signals. | Cables, Fiber optics, Hubs, Wi-Fi radio frequencies |

### Layer 7: Application Layer

- **Role**: Serves as the direct window for applications to access network services. It does not represent the application itself (like Chrome), but rather the protocol Chrome uses.
- **Key Functions**: Resource sharing, remote file access, and email handling.

### Layer 6: Presentation Layer

- **Role**: Acts as the translator for the network, ensuring data is in a readable format for the application layer.
- **Translation**: Converts different data formats (e.g., EBCDIC to ASCII).
  - Encryption: Secures data via protocols like SSL/TLS.
  - Compression: Reduces file sizes to maximize transmission speed.

### Layer 5: Session Layer

- **Role**: Controls the conversations between devices by building, maintaining, and closing communication paths.
- **Key Functions**: Dialogue discipline (half-duplex or full-duplex control) and checkpointing to resume interrupted downloads.

### Layer 4: Transport Layer

- **Role**: Ensures complete, ordered, and error-free message delivery between end-user devices.
- **Segmentation**: Breaks large blocks of application data into manageable "segments".
  - Flow Control: Matches transmission speed to the receiver's processing capabilities.
  - Error Control: Uses mechanisms like TCP acknowledgements to trigger retransmissions if segments are lost.

### Layer 3: Network Layer

- **Role**: Determines the best physical path for data to travel across interconnected networks.
- **Logical Addressing**: Utilizes IP addresses to identify source and destination devices across networks.
  - Routing: Evaluates network pathways and forwards data packets accordingly.

### Layer 2: Data Link Layer

- **Role**: Manages error-free transmission of frames over the physical link connecting two specific nodes.
- **Physical Addressing**: Uses unique hardware MAC addresses to identify local devices.
  - Framing: Packs raw network-layer packets into standard frames with distinct headers and trailers.

### Layer 1: Physical Layer

- **Role**: Handles the mechanical and electrical specifications required to move raw binary data streams (0s and 1s) over a physical medium.
- **Key Functions**: Defines bit-rate control, physical topologies (star, mesh), and signal representation (voltage levels, light pulses).

## Data Encapsulation and De-encapsulation

As data travels down through the layers on the sender's device, each layer appends its own control data (headers/trailers) in a process called **encapsulation**. When the data arrives at the receiver, it travels back up the stack, and each layer strips away its corresponding header to reveal the original data, a process known as **de-encapsulation**.

## Protocol Data Unit

As data moves down through the OSI layers, each layer adds its own control information (headers and trailers) to the data it receives from the layer above. The entire bundle at that specific stage is called a Protocol Data Unit.

## Client-Server architecture

A centralized model where distinct clients request data and a centralized server responds. e.g. web browser(HTTP / HTTPS), file transfer(FTP / TFTP), Email service(SMTP / IMAP / POP3), IP assignment (DHCP), Remote access (SSH / Telnet), Web sockets, etc.

## Peer-to-Peer (P2P) Architecture

A decentralized model where every computer (peer) acts as both a client and a server, sharing the workload. E.g. file transfer (BitTorrent), WebRTC (hybrid peer-to-peer)
