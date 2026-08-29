## Fault Tolerance

Fault tolerance is a system's ability to continue operating properly and without interruption despite the failure of hardware components or software bugs.

## Stateful vs. Stateless servers

### Stateful architecture

A stateful server remembers client data (**state**) from one request to the next. In a stateful setup, the web server stores session data locally in its own RAM or hard drive.

To make this work horizontally, enable Sticky Sessions (**Session Affinity**) on your load balancer. The load balancer inspects a cookie or IP address to ensure User A always routes to Server 1.

#### Disadvantages

- **Poor Load Distribution**: If User A sends massive amounts of traffic, Server 1 gets crushed while Server 2 sits idle.
- **Harder Scaling**: You cannot easily shut down a server for maintenance or downscale during low-traffic hours without destroying the sessions of active users.
- **No Fault Tolerance**: If Server 1 crashes, User A's shopping cart and login session vanish instantly.

### Stateless architecture

Stateless server is a computing model where the server processes each client request entirely independently, without retaining any memory or session information from previous interactions.

When User A sends a request, the load balancer routes it to a server (eg. Web Server 2). Web Server 2 reads User A's token, fetches their session data from a centralized cache server, processes the request, and returns the response.

- **True Horizontal Scaling**: You can add 100 new web servers or delete 50 of them in seconds. Traffic distributes perfectly.
- **High Fault Tolerance**: If Web Server 1 explodes mid-request, the load balancer instantly retries the request on Web Server 2. The user notices zero downtime because their data lives safely in the central cache.

> State cannot be destroyed; it can only be moved

## Vertical scaling

Vertical scaling, also known as scaling up, is the addition of more power (CPU, RAM, Storage) to an existing server. It is used for

- **Simplicity**: Easiest to implement. Your codebase generally doesn't need to change because your application still runs on a single node.
- **Connectivity**: Different parts of system communicate with each other via Inter-Process communication.
- **Stateful Apps**: If application relies heavily on local state or complex in-memory processing hard to distribute.
- **Monolithic Architectures**: Early-stage startups or MVPs where operational simplicity beats high availability.

**Drawbacks**: Hardware Limits, Single Point of Failure (SPOF), Cost Inefficiency

## Horizontal Scaling

Horizontal scaling, also known as sharding, is the practice of adding more servers. Sharding separates large databases into smaller, more easily managed parts called shards. It is used when we need

- **High Availability (HA)**: If one machine dies, others are still running to take the traffic.
- **Massive Traffic**: Infinite scalability (theoretically). If you need to handle more requests, add more nodes.
- **Connectivity**: Server communicate with each other via HTTP, gRPC, RPC (Remote Procedure Calls), or TCP sockets over a network interface.
- **Cloud Computing**: Perfectly aligns with cloud infrastructure where you can spin up servers in seconds.

**Drawbacks**: Stateless architecture complexity, Handling stick sessions, Load Balancing, Data consistency.

## GeoDNS

Geographical Domain Name System (GeoDNS) is a service that directs internet users to the nearest or most appropriate server based on their physical location.

## Binary Large OBject

A Binary Large Object (Blob) is a distributed architecture built to store and retrieve massive volumes of unstructured data (e.g., images, videos, backups, and logs). It is highly scalable, fault-tolerant, and decouples raw file storage from relational database operations.

## Rate Limiter

A rate limiter controls the number of requests a client can make to an API within a specific timeframe. It protects systems from overload, prevents resource exhaustion (e.g., DoS attacks), and ensures fair API usage.

## Throttling

Throttling is a system design technique used to control the rate at which requests are processed or resources are allocated. Its primary goal is to prevent service overload, manage traffic spikes, and maintain system availability by gracefully delaying or rejecting excess operations.

## Functional Requirements

These are the specific functions, features, and capabilities the system must deliver to satisfy business goals and user needs. They translate directly to system behaviors, inputs, and outputs. Examples

- User Authentication: Users can log in with a username and password.
- Order Processing: The system calculates the total price, taxes, and shipping fees.
- Report Generation: An admin can export monthly sales data to a CSV file

## Non-Functional Requirements

These define the underlying properties and operational constraints of the system. Often referred to as "quality attributes" or the "ilities". They dictate the user experience and the system's overall health. Examples:

- Performance: The platform must load product pages in under two seconds.
- Security: All user passwords must be securely hashed and encrypted using AES-256.
- Reliability/Availability: The system must maintain 99.99% uptime.
- Scalability: The application can seamlessly handle a traffic spike of up to 100,000 concurrent users.
