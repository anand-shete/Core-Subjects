## Proxy Server

A proxy server is an intermediary server (software or hardware) that sits between clients and backend services to manage, filter, and route traffic.

### Forward Proxy

A forward proxy sits between internal clients (users) and external networks (the internet). It handles outbound requests on behalf of the client.

#### Advantages

- Anonymity
- Grouping of Requests
- Access restricted contents
- Security
- Caching

#### Disadvantages

- Introduces Single Point of Failure, where if the forward proxy goes down, no internal client can access the internet
- The proxy administrator can see and log all unencrypted client traffic (Privacy Risks)

### Reverse Proxy

A reverse proxy sits in front of backend servers, intercepting inbound requests from the external internet. Clients think they are communicating directly with the backend.

#### Advantages

- Security (e.g. DDoS attacker will only access IP of reverse proxy servers)
- SSL Termination
- Caching (e.g. CDN is Reverse Proxy Server)
- Compression
- Load Balancer

## Proxy vs VPN

| Feature         | Proxy                                      | VPN                                          |
| --------------- | ------------------------------------------ | -------------------------------------------- |
| **Scope**       | App-level or browser-level configurations. | System-wide (routes all device traffic).     |
| **Encryption**  | None by default (only masks your IP).      | Fully encrypts the data tunnel.              |
| **Performance** | Faster (no encryption overhead).           | Slower (due to heavy encryption processing). |

## Proxy vs Load Balancer

| Feature          | Reverse Proxy                                  | Load Balancer                                         |
| ---------------- | ---------------------------------------------- | ----------------------------------------------------- |
| **Primary Goal** | Request manipulation, security, and caching.   | High-throughput traffic distribution.                 |
| **Layer**        | Usually Layer 7 (Application) to inspect data. | Can operate at Layer 4 (Transport) for raw speed.     |
| **Context**      | Evaluate what the request is (headers, URLs).  | Evaluates where to send traffic based on server load. |

## Firewall

A firewall is a network security device that monitors and filters incoming/outgoing network traffic based on an organization's previously established security rules

## Proxy vs Firewall

| Feature           | Proxy                                                                          | Firewall                                                                                          |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Mechanism**     | Acts as a middleman; establishes connections on behalf of the client/server.   | Acts as a barrier; inspects packets passing through without establishing a separate connection.   |
| **Traffic Focus** | Primarily handles Layer 7 (Application) data, caching, and payload inspection. | Primarily handles Layers 3 & 4 (IP addresses, protocols, port numbers) to block or allow traffic. |
| **Intent**        | Bridge connections while hiding identities or caching data.                    | Prevent unauthorized access and malicious network intrusions.                                     |
