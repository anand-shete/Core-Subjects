# Core Subjects and System Design

Notes of Database Management System, Operating Systems, Computer Networking and System Design (LLD and HLD)

## References

[Most asked Interview Questions](https://takeuforward.org/interviews/must-do-questions-for-dbms-cn-os-interviews-sde-core-sheet)  
[System Design Practice Problems](https://takeuforward.org/system-design/complete-system-design-roadmap-with-videos-for-sdes)  
[Back of the Envelope calculations](https://bytebytego.com/courses/system-design-interview/back-of-the-envelope-estimation)  
[Shrayansh HLD Course](https://www.youtube.com/playlist?list=PL6W8uoQQ2c63W58rpNFDwdrBnq5G3EfT7)  
[Shrayansh LLD Course](https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW)


# Folder Structure

## Networking

1. [The OSI Model](./networking/1-osi-model.md)
   - 7 Layers of OSI Model

2. [Domain Name System](./networking/2-dns.md)
   - How a URL resolves into an IP address

3. [HTTP / HTTPS](./networking/3-http.md)
   - HTTP methods, status codes, headers
   - How HTTPS works (SSL/TLS handshake, symmetric vs. asymmetric encryption, certificates)
   - HTTP/1.1 vs. HTTP/2 vs. HTTP/3 (multiplexing, head-of-line blocking)

4. [TCP vs. UDP](./networking/4-tcp-vs-udp.md)
   - The 3-way connection handshake and 4-way teardown
   - Flow control and congestion control and TCP vs UDP

5. [Network Address Translation (NAT)](./networking/5-nat.md)
   - How routers map private IP addresses to a single public IP address

6. [Subnetting](./networking/6-subnets.md)
   - Classful vs. Classless (CIDR) subnetting
   - Subnet masks
   - Network/host address calculation.

## Operating Systems

1. [Processes vs. Threads](./operating-system/1-process-vs-thread.md)
   - Memory layout (Stack vs. Heap, text, data segments).
   - Context switching overhead and how it happens.
   - Multi-threading models and concurrency.

2. [Process Synchronization (Crucial for Backend)](./operating-system/2-process-synchronization.md)
   - Race conditions, Critical Section problem.
   - Mutex vs. Semaphores (and how they prevent data corruption).
   - Deadlocks: Definition, 4 necessary conditions, and prevention strategies.

3. [Memory Management](./operating-system/3-memory-management.md)
   - Virtual Memory and Paging (How the OS gives your app a massive, isolated memory space).
   - Thrashing and Page Faults.
   - Cache Locality (CPU caches, spatial vs. temporal locality—why arrays are faster than linked lists).

4. [I/O Management](./operating-system/4-IO-management.md)
   - Blocking vs. Non-blocking I/O (Crucial if you work with Node.js/asynchronous runtimes).

## Database Management Systems

1. [Relational vs. Non-Relational (SQL vs. NoSQL)](./database-management-system/1-relational-vs-non-relational.md)
   - When to use structured (PostgreSQL/MySQL) vs. document/key-value (MongoDB/Redis) databases.

2. [ACID Properties](./database-management-system/2-ACID-properties.md)
   - Deep dive into **Atomicity, Consistency, Isolation, and Durability**.
   - Transaction Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the anomalies they prevent (Dirty reads, Phantom reads).

3. [Indexing (The #1 Interview Favorite)](./database-management-system/3-indexing.md)
   - How B-Trees and B+ Trees work under the hood.
   - Clustered vs. Non-clustered indexes.
   - Why indexing speeds up reads but slows down writes.

4. [Normalization](./database-management-system/4-normalization.md)
   - 1NF, 2NF, 3NF, and BCNF (and when it makes sense to _denormalize_ for performance).

5. [Joins](./database-management-system/5-joins.md)
   - Inner, Left, Right, Full, and Cross Joins.

## High Level System Design (HLD)

1. [Basics of HLD](./system-design-HLD/1-basics-of-HLD.md)

2. [Network Protocols](./system-design-HLD/2-network-protocols.md)

3. [CAP Theorem](./system-design-HLD/3-CAP-theorem.md)

4. [Architecture Patterns](./system-design-HLD/4-architecture-patterns.md)

5. [Advanced Microservices Patterns](./system-design-HLD/5-advance-patterns.md)

6. [Scaling from 0 to 1 Million Users](./system-design-HLD/6-scale-0-to-1-million-user.md)

7. [Consistent Hashing](./system-design-HLD/7-consistent-hashing.md)

8. [Design: URL Shortener](./system-design-HLD/8-design-URL-shortner.md)

9. [Back of the Envelope Estimation](./system-design-HLD/9-back-of-the-envelope.md)

10. [Design: Key-Value Database](./system-design-HLD/10-design-key-value-database.md)

11. [SQL or NoSQL?](./system-design-HLD/11-sql-or-no-sql.md)

12. [Design: WhatsApp](./system-design-HLD/12-design-whatsapp.md)

13. [Design: Rate Limiter](./system-design-HLD/13-design-rate-limiter.md)

14. [Design: Idempotent POST API](./system-design-HLD/14-design-idempotent-post-api.md)

15. [High Availability Systems](./system-design-HLD/15-high-availability-system.md)

16. [Message Queues](./system-design-HLD/16-message-queues.md)

17. [Proxy Server](./system-design-HLD/17-proxy-server.md)

18. [Load Balancer](./system-design-HLD/18-load-balancer.md)

19. [Caching](./system-design-HLD/19-caching.md)

20. [Distributed Transaction Handling](./system-design-HLD/20-distributed-transaction-handling.md)

21. [Database Indexing](./system-design-HLD/21-database-indexing.md)

22. [Concurrency Control](./system-design-HLD/22-concurrency-control.md)

23. [Two-Phase Locking](./system-design-HLD/23-two-phase-locking.md)

24. [OAuth Authentication](./system-design-HLD/24-oauth-authentication.md)

25. [Cryptography](./system-design-HLD/25-cryptography.md)

26. [JSON Web Tokens (JWT)](./system-design-HLD/26-json-web-token.md)

> I have also added excalidraw notes for system design architectures

## Low Level System Design (LLD)

1. [Object-Oriented Design](./system-design-LLD/1-object-oriented-design.md)

2. [SOLID Principles](./system-design-LLD/1.2-SOLID-principles.md)

3. [Design Patterns Overview](./system-design-LLD/1.3-design-patterns.md)

4. [Strategy Design Pattern](./system-design-LLD/2-strategy-design-pattern.md)

5. [Observer Design Pattern](./system-design-LLD/3-observer-design-pattern.md)

6. [Decorator Pattern](./system-design-LLD/4-decorator-pattern.md)

7. [Factory & Abstract Factory Pattern](./system-design-LLD/5-factory-and-abstract-factory.md)

8. [REST API Design](./system-design-LLD/rest-api.md)

9. [Low Level Design Concepts](./system-design-LLD/low-level-design.md)

This repository is a work in progress — I am currently in my learning phase and actively adding more **LLD concepts**, design patterns, and case studies
