# Network Address Translation

Network Address Translation (NAT) is a networking method used by routers to map private IP addresses to a single public IP address.

- This process modifies the network address information in the IP packet headers while they are in transit.
- The older IPv4 standard only supports about 4.3 billion addresses
- Primary purpose of NAT is to conserve the limited pool of global IPv4 addresses while allowing multiple local devices to safely access the internet

## Three Main Types of NAT

1. **Port Address Translation (PAT) / NAT Overload**: The most common form used in homes and offices. It maps thousands of private internal IP addresses to a single public IP address by assigning each device a unique temporary port number.
2. **Static NAT**: Permanently maps one private IP address to one specific public IP address on a 1:1 basis. This is typically used for hosting web or mail servers that external users need to access reliably.
3. **Dynamic NAT**: Maps private IP addresses to an available public IP address selected from a pool of registered public addresses

## Network Interface Controller

A Network Interface Controller (NIC) is a hardware component that connects a computer or device to a computer network. It serves as the physical and logical bridge between your device and the internet.

## MAC Address

A Media Access Control (MAC) address is a unique, permanent physical hardware identifier assigned to a Network Interface Controller (NIC) by its manufacture.

- While an IP address can change depending on your location, a MAC address functions like a **device's permanent digital fingerprint**.
- MAC addresses operate at Layer 2 (**Data Link Layer**).

> MAC addresses are only used when communicating on Local Area Network

# MAC Address Format

A MAC address is a 48-bit string typically written as 12 hexadecimal characters separated by colons or hyphens.
`MM:MM:MM:SS:SS:SS` or `MM-MM-MM-SS-SS-SS`. E.g. `00:1A:2B:3C:4D:5E`

It is split into two halves
**Organizationally Unique Identifier (OUI)**: The first 6 characters identify the manufacturer (e.g., Apple, Intel, Cisco).
**Network Interface Controller Specific**: The last 6 characters serve as a unique serial number assigned by that specific manufacturer

# Virtual IP

A Virtual IP Address (VIP or VIPA) is an IP address that is not physically bound to a single hardware network interface card (NIC).
