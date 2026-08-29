## Classful Subnetting

Classful networking is an older IP addressing architecture that divides the IPv4 address space into five distinct Classes (A, B, C, D, and E).

| Class       | First Octet Range | Default Subnet Mask | CIDR Notation | Number of Networks | Hosts per Network | Primary Use Case                                |
| ----------- | ----------------- | ------------------- | ------------- | ------------------ | ----------------- | ----------------------------------------------- |
| **Class A** | 1 to 126          | 255.0.0.0           | `/8`          | 128                | 16,777,214        | Massive corporations, governments               |
| **Class B** | 128 to 191        | 255.255.0.0         | `/16`         | 16,384             | 65,534            | Medium to large organizations, universities     |
| **Class C** | 192 to 223        | 255.255.255.0       | `/24`         | 2,097,152          | 254               | Small businesses, home networks                 |
| **Class D** | 224 to 239        | None                | N/A           | N/A                | N/A               | Multicasting (video streaming, routing updates) |
| **Class E** | 240 to 255        | None                | N/A           | N/A                | N/A               | Experimental, research, and future use          |

> **Note:** The 127 network range (eg. `127.0.0.1`) is omitted from Class A because it is strictly reserved for local loopback testing.

- **Class A Subnet (`255.0.0.0` / `/8`)**
  - The first 8 bits represent the network. The remaining 24 bits represent the hosts.
  - In the IP address `10.50.4.1`, the network is `10.0.0.0` while host is `0.50.4.1`
  - Range of class A subnet: `1.0.0.0` to `126.255.255.255`

- **Class B Subnet (`255.255.0.0` / `/16`)**
  - The first 16 bits represent the network. The remaining 16 bits represent the hosts.
  - In the IP address `172.16.5.20`, the network is `172.16.0.0`.
  - Range of class B subnet: `128.0.0.0` to `191.255.255.255`.

- **Class C Subnet (`255.255.255.0` / `/24`)**
  - The first 24 bits represent the network. Only the last 8 bits represent the hosts.
  - In the IP address `192.168.1.55`, the network is `192.168.1.0`.
  - Range of class C subnet: `192.0.0.0` to `223.255.255.255`.

## Classless Subnetting / CIDR (Classess Inter Domain Routing)

- When we talk about subnets today, its always Classess subnetting / CIDR
- In CIDR, the number after the slash tells you exactly how many bits are locked for the network.
- The remaining bits are unlocked and flexible for your devices (hosts).
- Range starts from given address to total address and exclude start (**Network ID**) and end address (**Broadcast Address**)

- **For subnet $10.0.1.0/24$**
  - Unlocked bits: $32 - 24$ = $8$
  - Total addreses: $2^8$ = $256$ IPv4 addresses
  - Range : $10.0.1.1$ to $10.0.1.254$ so $254$ usable IPv4 addresses

- **For subnet $10.0.1.0/28$**
  - Unlocked bits: $32-28$ = $4$
  - Total addresses: $2^4$ = $16$ addresses
  - Usable addresses: $10.0.1.1$ to $10.0.1.14$ so $14$ usable addresses

- **For subnet $10.0.1.0/16$**
  - Unlocked bits: $32-16$ = $16$
  - Total addresses: $2^{16}$ = $65536$ addresses
  - Usable addresses: $10.0.0.1$ to $10.0.255.254$ so $65534$ usable addresses

- **For subnet $10.0.1.5/32$**
  - Unlocked bits: $32-32$ = $0$
  - Total addresses: $2^0$ = $1$ address
  - Usable addresses: $10.0.1.5$

- **For subnet $0.0.0.0/0$** (Anywhere)
  - Unlocked bits: $32-0$ = $32$
  - Total addresses: $2^{32}$ = $4294967296$ addresses
  - Usable addresses: $0.0.0.0$ to $255.255.255.255$ (only exception)
