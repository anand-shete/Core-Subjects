## Caching

Caching is the process of storing frequently accessed data in a temporary, high-speed storage layer (usually RAM) to reduce latency, avoid repeated computations, and decrease the load on primary databases

## Types of Caching

- Client-side caching (browser caching e.g. HTTP Cache Headers, Service Workers)
- Content Delivery Network (e.g. Cloudflare, Akamai)
- Server side (e.g. Redis, Memcached)
- Reverse Proxy/ Gateway caching (e.g. Nginx, Varnish cache)

## Traditional caching

1. Fails due to Single Point of Failure in System
2. Difficult to scale

## Distributed caching

We have cache pool containing many cache servers

- app server use cache client to connect to cache server from cache pool

## Caching Strategies

Caching strategies define how your Application interacts with a Cache layer to read and write data.

## Read Strategies

These strategies dictate how data is fetched when a user or application requests it.

### 1. Cache-Aside (Lazy Loading)

The application looks for data in the cache first. If it is a **cache hit,** it returns the data. If it is a **cache miss**, the application queries the database, returns the data to the user, and writes it to the cache for next time.

**Pros**

- Highly resilient to cache failures
- Only requests data that is actually needed.

**Cons**

- First-time requests suffer from data latency (this can be resolved if we pre-heat cache)
- Data can become stale if modified directly in the database.

### 2. Read-Through

The application treats the cache as the primary data store and requests data from it directly. On a cache miss, the cache layer itself queries the database, updates its own store, and returns the data to the application.

**Pros**

- Simplifies application logic
- Optimized for high-read workloads.

**Cons**

- Relies heavily on the cache provider supporting this feature.

## Write Strategies

These strategies dictate how the system handles updates and additions when data is modified.

### 1. Write-Through

The application writes data to the cache, and the cache immediately writes it to the database before confirming success to the application.

**Pros**

- Data is never stale
- Guarantees consistency between cache and database.

**Cons**

- Writes are slow because every update requires two write operations.

### 2. Write-Behind (Write-Back)

The application writes data only to the cache, which acknowledges the write instantly. The cache then queues the updates and writes them to the database in asynchronous batches later.

**Pros**

- Incredibly fast write performance
- Perfect for write-heavy applications.

**Cons**

- High risk of data loss if the cache crashes before the data is flushed to the database.

### 3. Write-Around

Data is written directly to the database, bypassing the cache entirely. The cache is only updated later when a Read-Through or Cache-Aside operation triggers a cache miss.
**Pros**: Prevents the cache from being flooded with data that may never be read again.
**Cons**: A read request immediately following a write will always trigger a cache miss

## Cache Eviction Policies

Because cache memory is expensive and finite, systems must use eviction rules to remove old data when the cache fills up.

### Least Recently Used (LRU)

Least Recently Used discards the data that hasn't been accessed for the longest period.

### Least Frequently Used (LFU)

Least Frequently Used discards the data that has been requested the fewest number of times.

### First In First Out (FIFO)

First In First Out Discards the oldest data in the order it arrived, regardless of use.

### Time To Live (TTL)

Time To Live automatically expires and removes data after a pre-set duration.

## Cache Penetration

Cache Penetration is when a malicious attacker requests a user ID that does not exist (e.g. `user_99999999`). The app checks the cache (Miss), hits the database (Miss), and returns nothing. The attacker blasts millions of these requests. Because the data doesn't exist, it is never cached, and every single request hits and melts your raw database.

- Fix: Use a **Bloom Filter** or cache empty/null results.

## Cache Stampede

Cache Stampede (Thundering Herd) is when a highly popular cache key (e.g. the homepage layout data) expires. Suddenly, 50,000 concurrent user requests hit a cache miss at the exact same millisecond. All 50,000 requests slam the database simultaneously to fetch the same data, completely knocking the database offline.

- Fix: Use **locking mechanisms** so only one thread recomputes the cache
