# System Design: URL Shortener

Clarify the scope by asking the interviewer specific questions regarding functional scale, security, and performance constraints.

### Clarifying Questions

- Q: "What is the expected read-to-write ratio? Is this a read-heavy system?"
- Q: "Do we need to support custom short aliases provided by the user, or only system-generated ones?"
- Q: "Should the shortened URLs have an expiration date, or do they exist indefinitely?"
- Q: "Is security or non-guessability a strict constraint to prevent malicious enumeration of URLs?"

## 1. Requirement Analysis

### Functional Requirements

- Generate a unique, short alias for a given long URL.
- Redirect users clicking the short URL to the original long URL.
- Support custom aliases if needed (handled as an edge case).

### Non-Functional Requirements

- High Availability: Reads must be heavily prioritized over writes (system must not go down during traffic spikes).
- Low Latency: Redirection must take sub-100ms.
- Security: Short URLs must be non-sequential to prevent bulk enumeration attacks.

## 2. Capacity Estimation Math

Next, I will establish the storage and throughput scale to justify the architectural choices.

### Scale Assumptions

- Daily Write Volume: Assume 10 Million new URLs generated per day.
- Read/Write Ratio: Let us assume a 100:1 read-to-write ratio.
- Daily Read Volume: 1 Billion redirections per day.
- Total Scale (10-Year Horizon):
  $$10 \text{ Million/day} \times 365 \text{ days/year} \times 10 \text{ years} \approx 36.5 \text{ Billion URLs}$$

### URL Length & Character Set Selection

- Using a standard Base62 character set: 0-9 + a-z + A-Z = 62 characters.
- To determine the optimal URL length (N), we calculate the total combinations ($62^N$):
  - 62⁶ ≈ 56 Billion combinations
  - 62⁷ ≈ 3.5 Trillion combinations
  - 62⁸ ≈ 218 Trillion combinations
- Design Decision: A length of 7 characters is chosen. It provides 3.5 Trillion combinations, which safely clears the 10-year requirement of 36.5 Billion while keeping the URL highly compact.

## 3. Core URL Generation (Architectural Trade-offs)

I will evaluate two primary design patterns for generating the 7-character string, highlighting the engineering trade-offs of each.

### Approach A: Hashing and Truncating (MD5 / SHA-1)

- Mechanism: Pass the input Long URL (potentially appended with a unique user Salt) through an MD5 or SHA-1 hash function. Truncate the resulting hash to extract the first 7 characters.
- Trade-off Analysis:
- Pros: Completely decentralized; no coordinating server required to generate strings.
  - Cons (The Collision Bottleneck): Truncating a 128-bit hash to a 7-character string introduces a mathematical risk of collisions.
  - Mitigation: The system must execute a "Read-Before-Write" query against the database to confirm uniqueness. If a collision occurs, a random salt must be appended and the process repeated. This introduces significant database read latency on the write path.

### Approach B: Token/ID Generation with Base62 Encoding

- Mechanism: Maintain a unique, monotonically increasing 64-bit integer ID generator. When a write request arrives, the system fetches a new ID (e.g., 125193) and encodes it mathematically into Base62 (e.g., cb8).
- Trade-off Analysis:
- Pros: Zero mathematical collisions. Every unique auto-incremented integer guarantees a globally unique Base62 string.
  - Cons (The Security & Predictability Flaw): Sequentially auto-incremented IDs translate directly into sequential short URLs. This allows an attacker to trivially enumerate and scrape the database by incrementing the URL strings.
  - Mitigation: A distributed token or coordinate generator is required to obfuscate or distribute ID assignment.

## 4. Distributed Systems Scaling & Coordination

To implement Approach B at scale without creating a single point of failure or an increment bottleneck, I propose two distributed coordination strategies.

### Option 1: Distributed Key-Range Allocation via Apache ZooKeeper

- Mechanism: Utilize Apache ZooKeeper as a centralized consensus orchestrator. ZooKeeper manages chunks or ranges of IDs (e.g., Worker 1 receives IDs 1 to 1 Million; Worker 2 receives 1 Million to 2 Million).
- Trade-off Analysis:
- Application web servers consume tokens locally from their assigned range memory cache.
  - They only communicate with ZooKeeper when their range is exhausted, eliminating the global database increment lock.
  - If a worker node crashes, the unconsumed IDs within its allocated range are lost, but ID uniqueness remains completely uncompromised.

### Option 2: Decentralized Generation via Twitter Snowflake

- Mechanism: Implement a completely decentralized 64-bit unique ID generator across all nodes. The 64-bit ID structure is split:
- 41 bits for a millisecond timestamp.
  - 10 bits for a configured Machine ID / Worker ID.
  - 12 bits for a local sequence number (to handle concurrent requests on the same millisecond).
- Trade-off Analysis:
- Highly scalable and completely eliminates the need for a central coordinator like ZooKeeper.
  - IDs are naturally ordered roughly by time, eliminating lock contention.

## 5. High-Level System Architecture & Read/Write Flows

### The Write Path (URL Generation)

$$\text{Client} \longrightarrow \text{Load Balancer} \longrightarrow \text{Web Server} \longrightarrow \text{ID Generator (Snowflake/ZooKeeper)} \longrightarrow \text{Base62 Encoder} \longrightarrow \text{NoSQL DB}$$

### The Read Path (URL Redirection)

$$\text{Client} \longrightarrow \text{Load Balancer} \longrightarrow \text{Web Server} \longrightarrow \text{In-Memory Cache (Redis)} \overset{\text{Cache Miss}}{\longrightarrow} \text{NoSQL DB}$$

## 6. Detailed Component Deep-Dive

### Database Selection

- Choice: NoSQL Key-Value Store (e.g., Amazon DynamoDB) or Wide-Column Store (e.g., Apache Cassandra).
- Justification: The relational structure is nonexistent. The data access pattern consists entirely of a flat dictionary lookup: Short_URL_Key -> Long_URL_Value. NoSQL scales horizontally to handle massive read throughput far more easily than traditional RDBMS systems.

### Caching Strategy

- Mechanism: Introduce an in-memory caching tier using Redis or Memcached sitting in front of the database.
- Justification: Apply the Pareto 80/20 rule: 20% of the hot, trending URLs generate 80% of the total redirection read volume.
- Eviction Policy: Use a Least Recently Used (LRU) eviction strategy to maximize cache hit ratios for active links.

### HTTP Status Code Selection

- 301 Permanent Redirect: The client browser caches the destination address. Subsequent visits to that short URL bypass our servers entirely and hit the target website directly. This minimizes our cluster's CPU load but strips us of downstream real-time click analytics.
- 302 Temporary Redirect: Every single user click hits our servers first before redirecting. This increases web server load but guarantees precision for data analytics, tracking, and geographic telemetry.
- Interview Choice: I recommend a 301 redirect for optimal system performance, unless tracking/analytics is explicitly specified by the interviewer as a priority requirement.
