## Scaling from 0 to 1 million users

### 1. Single Server (~0 to 100 Users)

**Setup**: Everything (App code, Database, Files) lives on one single cloud instance (like an AWS EC2).
**Bottleneck**: Single Point of Failure (SPOF). If the server crashes, the entire app goes down. CPU and RAM are shared between the web traffic and database queries, slowing everything down.

### 2. Separation of Application and Database Servers (~1,000 Users)

**Setup**: Move the database to its own dedicated machine (e.g., AWS RDS).
**Bottleneck**: The application and database now scale independently. You can optimize the DB server for disk I/O and RAM, and the app server for CPU.
**Next Problem**: One app server hits a hardware ceiling. You need to scale out, not just up.

### 3. Load Balancer & Horizontal Scaling (~10,000 Users)

**Setup**: Introduce a Load Balancer (like Nginx or AWS ALB) in front of multiple, identical app servers.
**Bottleneck Solved**: Eliminates the application SPOF. Traffic is distributed evenly (Round Robin or Least Connections).
**Interview Catch**: App servers must be stateless. You cannot store sessions in server RAM anymore (unless you use Sticky Sessions, which we know makes scaling harder). Use a shared token setup (JWT) or a central session store.

### 4. Database Replication: Master-Slave (~50,000 Users)

**Setup**: Writes go strictly to the Master DB, which replicates data to one or more Slave DBs. All reads go to the Slaves.
**Bottleneck Solved**: Most web applications are read-heavy (e.g., 90% reading posts, 10% creating posts). This removes the read pressure from the Master database.
**Interview Catch**: Acknowledge the consistency trade-off. If replication is asynchronous to keep writes fast, reads might be slightly stale for a few milliseconds (Eventual Consistency).

### 5. Caching Layer (~100,000 Users)

**Setup**: Introduce an in-memory database like Redis or Memcached between the app servers and the SQL database.
**Bottleneck Solved**: Prevents hitting the database for repetitive, expensive queries (e.g., fetching a product catalog or user profile). RAM is magnitudes faster than reading from a database disk.
**Interview Catch**: You must mention a Cache Invalidation Strategy (like Cache-Aside or Write-Through) and setting a proper TTL (Time to Live) so users don't see ancient data forever.

### 6. Content Delivery Network (CDN) (~500,000 Users)

**Setup**: Use a service like Cloudflare or AWS CloudFront to cache static assets (images, videos, HTML, CSS, JS) at edge servers geographically close to the users.
**Bottleneck Solved**: Strips massive traffic away from your app servers entirely. If a user in London requests an image, they get it from a London edge server instead of waking up your app servers in New York. Lower latency, cheaper bandwidth.

### 7. Message Queues (~750,000 Users)

**Setup**: Introduce a message broker like RabbitMQ or Apache Kafka to decouple synchronous operations.
**Bottleneck Solved**: Turns blocking tasks into asynchronous background jobs.

### 8. Multiple Data Centers & Sharding (~1 Million+ Users)

**Setup**:

- **Multi-Region**: Deploy the entire stack across multiple geographic locations (e.g., US-East and EU-West) using GeoDNS to route users to the closest data center.
- **DB Sharding**: Break large database tables into smaller, distinct pieces across separate database servers (e.g., Users A-M go to Shard 1, Users N-Z go to Shard 2).

**Bottleneck Solved**: Complete disaster tolerance and bypassing the absolute structural limits of a single relational database instance.
