## Load Balancer
A load balancer acts as a **reverse proxy server** that intelligently distributes incoming network traffic or computational tasks across multiple backend servers or nodes in a distributed system.

Its primary purpose is to ensure high availability, reliability, and optimal performance by preventing any single server from becoming a bottleneck or a single point of failure

## Types of Load Balancers

### Network Load Balancer (L4 Balancer)

- Operates at the Transport Layer (TCP/UDP).
- Routes traffic based on IP addresses and ports.
- Does not inspect packet content.
- Blazing fast and consumes less memory.

### Application Load Balancer (L7 Balancer)

- Operates at the Application Layer (HTTP/HTTPS/FTP).
- Routes traffic based on packet content (URLs, cookies, headers).
- Supports smart features like SSL termination and session persistence.
- More CPU-intensive due to packet inspection

## Load Balancing Algorithms

Load balancing algorithms dictate the logic used to distribute incoming traffic. They apply to Layer 4 (Transport Layer) and Layer 7 (Application layer) in OSI model

### Static Algorithms (Stateless)

Static algorithms distribute traffic based on fixed, predetermined mathematical or structural logic. They do not monitor or adapt to the real-time health, performance, or resource utilization of backend servers.

#### 1. Round Robin

Distributes incoming requests sequentially and evenly down a list of available servers.

- Advantages:
  - Low Operational Overhead: Requires minimal CPU and memory resources to execute because it maintains no state.
  - Simple Implementation: Easy to configure, deploy, and troubleshoot.
  - Optimal for Homogeneous Environments: Performs effectively if all backend servers possess identical hardware specifications and process tasks of uniform complexity.
- Disadvantages:
  - Capacity Ignorant: Treats all servers equally, which can lead to the overloading of weaker hardware in a mixed-capacity cluster.
  - Traffic Weight Blind: Assumes every request requires the same processing time, leading to resource imbalances if one server receives multiple heavy processing requests sequentially.

#### 2. Weighted Round Robin

An extension of Round Robin where each server is assigned a static weight value corresponding to its processing capacity. Servers with higher weights receive a proportionally larger share of sequential requests.

- Advantages:
  - Heterogeneous Server Friendly: Allows safe and efficient traffic distribution across a cluster containing mixed hardware capacities.
  - Predictable Routing: Traffic patterns remain deterministic and highly predictable based on the assigned configuration.
- Disadvantages:
  - Inflexible to Runtime Fluctuations: Cannot dynamically adjust weights if a server's performance degrades due to background processes, hardware faults, or memory leaks.
  - Ignores Request Complexity: Does not account for sudden spikes in high-compute requests, which can still isolate and overwhelm a server.

#### 3. IP Hash

Combines the client's source and/or destination IP address to compute a unique mathematical hash. This hash maps the client to a specific backend server.

- Advantages:
  - Stateless Session Persistence (Stickiness): Ensures a user consistently routes to the same server, eliminating the need to sync session data (e.g., shopping carts) across a backend cluster.
  - No Cookie Dependency: Operates strictly at the network layer without needing to inspect HTTP payload headers or cookies.
- Disadvantages:
  - Uneven Traffic Distribution: If a large volume of users shares a single public IP via NAT (e.g., a corporate office), all traffic is directed to one server, causing an artificial hotspot.
  - Disrupted Connections on Network Switch: If a client transitions between networks (e.g., Wi-Fi to cellular data), their IP changes, causing the hash to recalculate and severing the active session.
  - Horizontal Scaling Issues: Adding or removing a server shifts the hashing boundaries, causing a cascade failure where most existing sessions are remapped to different servers. (Note: This can be mitigated using Consistent Hashing).

### Dynamic Algorithms (Statefull)

Dynamic algorithms inspect and analyze the real-time performance metrics, connection counts, or latency of backend servers before making routing decisions.

#### 1. Least Connection

Tracks active open connections on each server and routes the next incoming request to the node with the lowest connection count.

- Advantages:
  - Superior Load Management: Highly effective when request processing times vary widely (e.g., mixing long-running file downloads with rapid API requests).
  - Prevents Node Suffocation: Automatically starves overloaded or lagging nodes of new traffic until they clear their current request queue.
- Disadvantages:
  - State Tracking Overhead: The load balancer must track and update the concurrency state of every single connection, increasing its memory and CPU footprint.
  - Hardware Agnostic: If a high-capacity and low-capacity server both have 10 connections, it treats them as equally loaded, which can crash the weaker node.

#### 2. Weighted Least Connection

Combines active connection tracking with user-defined hardware capacity weights. The balancer distributes new connections based on the ratio of active connections to the assigned server weight.

- Advantages:
  - High Optimization: Considered the industry standard for production environments with mixed hardware specs and unpredictable request lifespans.
  - Balanced Resource Utilization: Maximizes throughput across the entire cluster by leveraging both real-time metrics and static capacity boundaries.
- Disadvantages:
  - Complex Implementation: Requires meticulous initialization of server weights alongside continuous real-time state tracking.

#### 3. Least Response Time (Least Latency)

Routes incoming requests to the server that possesses both the fewest active connections and the lowest average response latency (often evaluated using Time to First Byte - TTFB).

- Advantages:
  - Optimizes User Experience: Prioritizes the fastest performing nodes, reducing overall application latency for the client.
  - Proactive Failure Isolation: Automatically diverts traffic away from nodes experiencing silent degradation (e.g., slow disk I/O or thermal throttling) before a hard failure occurs.
- Disadvantages:
  - High Computational Cost: Requires continuous time calculations, sliding-window average tracking, and connection accounting on the load balancer.
  - The Herd Effect: Can cause traffic oscillations. If one node becomes exceptionally fast, the balancer may flood it with requests simultaneously, overwhelming the node before the next metrics cycle registers the slowdown.

> **Time to First Byte** (TTFB) is the time interval between sending a request and receiving response from server.
