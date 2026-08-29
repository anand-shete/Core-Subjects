## Application Programming Interface

An Application Programming Interface, is a set of rules and protocols that allows different software applications to communicate and share data with one another.

## HTTP API

An HTTP API is a type of interface that allows two software systems to communicate over the web using the Hypertext Transfer Protocol (HTTP). It can be stateful or stateless.

## REST API

Representational State Transfer Application Programming Interface (REST API) is an architectural style for building web services that allows different software applications to communicate with each other over the internet using the HTTP protocol.

- An API that adheres to specific REST architectural constraints.
- Must be **stateless** (server remembers nothing between calls).
- Uses HATEOAS (links in the response to guide the client)

### REST Principles

#### 1. Model endpoints as resources, not actions.

Use nouns instead of verbs in URL paths.

- `/users` instead of `/get-users`
- `/orders` instead of `/create-order`
- `/products/123` instead of `/delete-product/123`

Standardize plural names for collections:

- Collection: `/products`
- Single resource: `/products/123`

#### 2. Use HTTP methods correctly.

1. **GET**: Read a resource
2. **POST**: Create a resource
3. **PUT**: Update entire resource
4. **PATCH**: Update part of a resource
5. **DELETE**: Remove a resource

- Get all items: `GET /products`
- Create a new item: `POST /products`
- Get one single item: `GET /products/123`
- Update one single item: `PUT /products/123`
- Delete one single item: `DELETE /products/123`

#### 3. Keep requests stateless.

Each request should contain all information needed to process it.

- Include auth token on every request: `Authorization: Bearer <token>`
- Do not rely on server memory like "previous request data" to process current request

#### 4. Return appropriate [status codes](../networking/3-http.md) and a consistent error schema.

```json
{
  "error": "validation_failed",
  "statusCode": 400,
  "message": "The 'email' field must be a valid email address.",
  "timestamp": "2026-06-26T01:02:00Z"
}
```

#### 5. Validate all inputs and return predictable response shapes.

- Reject invalid payload with `422` instead of silently fixing data
- Keep response shape stable, such as always returning `{ "data": ..., "meta": ... }` for list endpoints

#### 6. Support filtering, sorting, pagination for collections.

Use query parameters like `/products?page=2&limit=20` to manage large collections efficiently.

- Filtering: `/products?category=books&inStock=true`
- Sorting + pagination: `/products?sort=price:asc&page=2&limit=20`

#### 7. Use HTTPS everywhere and standard auth (OAuth2/JWT/API keys as needed).

- Good: `https://api.example.com/v1/users`
- Avoid sending tokens over `http://...`

#### 8. Design for idempotency where required (especially retries and distributed systems).

- `PUT /users/42` called multiple times with same payload should result in same final state
- `POST /payments` with `Idempotency-Key: 8c2f...` prevents duplicate charge on retries

#### 9. Define caching behavior with Cache-Control and ETags where applicable.

- `Cache-Control: public, max-age=60` for frequently read public resources
- Use `ETag` + `If-None-Match` to return `304 Not Modified` when content has not changed

#### 10. Version safely and document everything with OpenAPI.

Prevent breaking changes by including a version number in the URL (`/api/v1/users`) or in headers from the start of the project.

- URL versioning: `/api/v1/users` -> `/api/v2/users`
- Publish OpenAPI docs so consumers can test and integrate consistently

## Communication Protocol

Communication protocols dictate how data is formatted and transmitted between client applications and backend systems, or between internal microservices. Choosing the right protocol directly impacts network performance, bandwidth consumption, and developer speed.

### REST

The traditional industry standard, built entirely on top of the existing rules and methods of the HTTP protocol.
**Working**: Resources are exposed via unique URLs (e.g., `/users/123`). State is managed using standard HTTP verbs (GET, POST, PUT, DELETE) and payloads are almost always returned as plain text JSON.
**Pros**: Universal compatibility, simple to learn, native browser support, and highly cacheable at the HTTP/CDN level.
**Cons**: Suffer from over-fetching (getting more data fields than you need) or under-fetching (requiring multiple API roundtrips to get related data).

> REST API use JSON, XML, Text data format

## GraphQL

A query language for APIs created by Meta to solve the inefficiency problems of mobile networks.

**Working**: The client submits a single `POST` request to a single endpoint (usually `/graphql`) containing a highly specific query text. The server executes this query and returns a JSON response containing only the exact fields requested.
**Pros**: Completely eliminates over-fetching and under-fetching. Clients can request deeply nested, related resources in a single network call. Strong typing via a strict schema.
**Cons**: Shifts query complexity to the server. Hard to implement native HTTP caching because every request uses `POST`. Risk of clients writing deeply recursive queries that crash the backend.

> GraphQL uses JSON as data format

## gRPC

Google Remote Procedure Call is a modern, open-source framework developed by Google designed for ultra-fast, high-performance communication.

**Working**: It uses Protocol Buffers (Protobuf) to serialize data into a dense binary format instead of text strings. It runs strictly on top of `HTTP/2`, enabling **multiplexing** (sending multiple requests over a single connection) and bi-directional streaming.
**Pros**: Incredible performance and low network latency. Extremely small payload sizes. Supports automatic code generation across dozens of programming languages. **Header compression** via HTTP/2 which relies on HPACK compression, keeping a shared table of headers between client and server, stripping out massive metadata overhead.
**Cons**: No native browser support (requires a proxy like gRPC-Web for frontend apps). Payload is binary, making it impossible for humans to read or debug without specialized tools

> Google Remote Procedure Call uses Binary (Protobuf)

## Realtime Communication

Real-time communication technologies enable a backend server to push fresh data to a client instantly without waiting for the client to ask for it. This breaks the traditional request-response model of standard HTTP.

### Long Polling

Long Polling is a clever emulation of real-time communication built on top of traditional `HTTP/1.1` request-response cycles.

**Mechanism**: The client requests data from the server. If the server has no new data, it deliberately holds the request open. The moment new data becomes available, the server responds, closing the connection. The client processes the data and instantly opens a brand-new long-polling request to repeat the process.
**Pros**: Works out-of-the-box on virtually any network, firewall, or older browser because it is just basic HTTP.
**Cons**: Incredibly resource-intensive. Every single response requires setting up and tearing down expensive HTTP headers and TCP connections. It introduces slight delays during the reconnect phase.

### Server-Sent Events

Server-Sent Events (SSE) are native, unidirectional protocol where a server maintains a persistent, long-lived connection to stream text data down to the client.

**Mechanism**: The client initiates a standard HTTP request using the `text/event-stream header`. The server keeps this connection open indefinitely. Whenever the server has an update, it pushes plain-text data down this open pipe.
**Pros**: Native browser support via the simple EventSource JavaScript API. Automatic reconnection out of the box. Lightweight and runs over standard `HTTP/2` or `HTTP/1.1`.
**Cons**: Strictly one-way (unidirectional). The client cannot send data back down the same pipe; it must use separate HTTP `POST` requests to talk back to the server. Browser limits apply if running over old `HTTP/1.1` (max 6 connections).

### WebSockets

WebSockets are distinct, bidirectional protocol providing full-duplex communication channels over a single, long-lived TCP connection.

**Mechanism**: The client initiates a standard HTTP request with an `Upgrade: websocket` header. If the server agrees, they perform a WebSocket handshake. The connection is upgraded, completely bypassing HTTP rules from that point forward. Both client and server can send binary or text frames at any millisecond.
**Pros**: Ultra-low latency and incredibly small frame overhead (as little as 2 bytes per message). True two-way (bidirectional) real-time streaming.
**Cons**: Does not run over standard HTTP, so some corporate firewalls and strict enterprise proxies block WebSocket traffic. Requires custom connection-state management, heartbeat pings, and horizontal scaling patterns (like Redis Pub/Sub).

## Edge Cases

### How to Scale WebSockets Horizontally

**Q**. If you have 10 million concurrent WebSocket connections, how do you scale them? WebSockets are stateful and bound to a specific physical server, standard stateless load balancing fails. If User A is connected to Server 1, and User B is connected to Server 2, they cannot talk to each other.

**A**. Decouple connection management from message routing. Use an adapter layer like Redis Pub/Sub or Apache Kafka behind your WebSocket servers. When User A sends a message, Server 1 publishes it to a Redis channel. Server 2 subscribes to that channel and pushes the message down to User B.
