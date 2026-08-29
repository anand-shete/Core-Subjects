## Hypertext Transfer Protocol

Hypertext Transfer Protocol (HTTP) is the foundational set of rules that allows web browsers and servers to communicate. It defines how messages are formatted and transmitted, allowing you to request web pages, view images, and interact with web applications across the World Wide Web.

**Stateless**: The server retains no memory of past requests.
**Isolation**: Every request is executed independently from scratch.
**Scalability**: Servers scale easily because they do not save session states.
**State Management**: Cookies, tokens, and sessions recreate state on top of HTTP.

## HTTP Methods

Methods tell the server what action to perform on a specific resource.

**GET**: Retrieves data without changing anything on the server.
**POST**: Submits new data to create a resource.
**PUT**: Replaces an existing resource entirely with new data.
**PATCH**: Applies partial updates to an existing resource.
**DELETE**: Removes a specific resource from the server.

## HTTP Status Codes

Servers reply with a three-digit code to show the result of a request.

- `1xx` **Informational**
  - `100 Continue`: Server notify client that initial request headers have been received.

- `2xx` **Success**
  - `200 OK`: General success code for successful GET, PUT, or PATCH requests.
  - `201 Created`: Successful POST request that creates a new resource.
  - `204 No Content`: Perfect for DELETE requests to tell show that request was processed, but there is no data to return.

- `3xx` **Redirection**
  - `301 Moved Permanently`: Requested resouce is assigned new permanent URL.

- `4xx` **Client Error**
  - `400 Bad Request`: Input validation failed.
  - `401 Unauthorized`: User is not logged in or their authentication token in invalid
  - `403 Forbidden`: User is authenticated but does not have permission/roles to access the resource.
  - `404 Not Found`: Requested resource or endpoint route does not exist.
  - `409 Conflict`: Request conflicts with current server state. E.g. email already exists

- `5xx` **Server Error**
  - `500 Internal Server Error`: Server throws an unhandled error or crashes.
  - `502 Bad Gateway`: Sent by Nginx when your upstream server goes down or crashes completely.
  - `503 Service Unavailable`: The server is temporarily overloaded or down for maintenance.

## HTTP Headers

Headers are key-value pairs sent in requests and responses to provide **metadata about the request**.

- **Request Headers**: Pass context like `User-Agent` (browser info) or `Authorization` (credentials) headers.
- **Response Headers**: Pass server context like `Content-Type` (e.g. text/html) or `Server` type.
- **Custom Headers**: Usually prefixed with `X-` (though deprecated) to pass proprietary application data. e.g. `X-Forwarded-Host`, `X-Forwarded-Proto`.

## HyperText Transfer Protocol Secure

HTTPS ensures your data is secure by layering the standard HTTP protocol **on top of TLS** (Transport Layer Security), which handles encryption and verification.

## Symmetric vs. Asymmetric Encryption

HTTPS uses a hybrid system combining both encryption styles to maximize both security and speed.

| Encryption Type | Keys Used                                                                        | Performance                    | Purpose in HTTPS                                                   |
| --------------- | -------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------ |
| Asymmetric      | Public Key (anyone can encrypt) and a Private Key (only the server can decrypt). | Slow and resource-heavy        | Used only at the very beginning to safely exchange secrets.        |
| Symmetric       | One shared Session Key used by both client and server to encrypt and decrypt.    | Extremely fast and lightweight | Used to encrypt all data transferred after the initial connection. |

## Digital Certificates

Before encryption starts, the client must verify the server's identity. SSL/TLS Certificates are a digital identity card containing the server's domain name, its public key, and an expiration date.

## Certificate Authorities

Certificate Authorities (CAs) are trusted global organizations (e.g. Let's Encrypt or DigiCert) that verify websites and sign their certificates. Browsers come pre-installed with a list of trusted root CAs. If a website's certificate is signed by a trusted CA, the browser trusts the connection. If not, you see a Your connection is not private error.

## TLS Handshake

Modern HTTPS uses **TLS 1.3**, which completes the entire handshake in just one round-trip (1-RTT) between client and server and it takes 2 steps

1. **ClientHello**: The browser sends supported TLS versions, cipher suites, and its own cryptographic public key share.
2. **ServerHello & Certificate**: The server responds with its chosen settings, its own public key share, and its digital certificate
   - **Key Calculation**: Both sides independently calculate a shared Session Key using the key shares they exchanged (via Diffie-Hellman). The secret key is never actually sent over the wire.
   - **Finished**: Both sides confirm that the handshake was secure, and all subsequent HTTP data is encrypted using the fast symmetric session key.

## HTTP/1.1 - The Legacy Standard (1997)

HTTP/1.1 served the web for over a decade but has massive architectural limitations for modern, asset-heavy websites.

- **Connection Model**: Uses persistent TCP connections, but it can only download one file at a time per connection.
- **Head-of-Line (HOL) Blocking**: If a browser requests a large image followed by a small script, the script is completely blocked until the image finishes downloading.
- **Workaround**: Browsers are forced to open up to 6 parallel TCP connections to a single domain to download assets simultaneously, which wastes server resources.

## HTTP/2 — The Multiplexing Revolution (2015)

HTTP/2 was designed to fix the parallel connection problem without altering how HTTP looks to developers.

- **Multiplexing**: Allows a browser to send hundreds of requests and responses concurrently over a single TCP connection. Files are broken into tiny frames and interleaved on the wire.
- **Header Compression** (HPACK): Compresses massive, repetitive HTTP text headers into tiny binary data to save bandwidth.
- **TCP HOL Blocking**: While it fixed application-level blocking, it introduced transport-level blocking. If a single TCP packet is dropped on a bad Wi-Fi network, TCP pauses all streams until that single missing packet is retransmitted.

## HTTP/3 — Shifting to QUIC (2022)

HTTP/3 completely re-engineers the underlying transport layer to eliminate the limitations of TCP.

- **Ditches TCP for UDP**: HTTP/3 abandons TCP completely. It runs on top of a new protocol called QUIC (Quick UDP Internet Connections), developed by Google.
- **True Multiplexing**: Because QUIC uses UDP, every stream is completely independent. If one packet drops, only that specific file slows down. Every other file continues downloading instantly.
- **Faster Connections (0-RTT)**: QUIC bakes the TLS 1.3 cryptographic handshake directly into the connection handshake. Connection setup drops from 2-3 round trips down to one round trip (or zero if you have connected before).
- **Connection Migration**: If your phone switches from Wi-Fi to cellular data, your TCP connection drops and must reconnect. HTTP/3 uses a unique Connection ID, allowing your download to continue seamlessly without interruption
