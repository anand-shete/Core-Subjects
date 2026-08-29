# Back of Envelope Estimation

- Use approximate and simple constraints e.g. 10M, 50M, 100M, etc.
- Clarify with interviewer if we should do capacity estimation for storage and RAM, bandwidth, etc.
- But, do not spend $\geq 10$ minutes in this section

## Power of Two

| Base 2 / Base 10          | Approximate value | Bse 2 / Base 10 Unit |
| ------------------------- | ----------------- | -------------------- |
| $2^{10} \approx 10^{3} $  | 1 Thousand        | 1 KiB $\approx$ 1 KB |
| $2^{20} \approx 10^{6} $  | 1 Million         | 1 MiB $\approx$ 1 MB |
| $2^{30} \approx 10^{9} $  | 1 Billion         | 1 GiB $\approx$ 1 GB |
| $2^{40} \approx 10^{12} $ | 1 Trillion        | 1 TiB $\approx$ 1 TB |
| $2^{50} \approx 10^{15} $ | 1 Quadrillion     | 1 PiB $\approx$ 1 PB |

## Latency numbers

| Operation name                                | Time                        |
| --------------------------------------------- | --------------------------- |
| L1 cache reference                            | $0.5\ ns$                   |
| Branch mispredict                             | $5\ ns$                     |
| L2 cache reference                            | $7\ ns$                     |
| Mutex lock/unlock                             | $100\ ns$                   |
| Main memory reference                         | $100\ ns$                   |
| Compress 1K bytes with Zippy                  | $10,000\ ns = 10\ µs$       |
| Send 2K bytes over 1 Gbps network             | $20,000\ ns = 20\ µs$       |
| Read 1 MB sequentially from memory            | $250,000\ ns = 250\ µs$     |
| Round trip within the same datacenter         | $500,000\ ns = 500\ µs$     |
| Disk seek                                     | $10,000,000\ ns = 10\ ms$   |
| Read 1 MB sequentially from the network       | $10,000,000\ ns = 10\ ms$   |
| Read 1 MB sequentially from disk              | $30,000,000\ ns = 30\ ms$   |
| Send packet CA (California) ->Netherlands->CA | $150,000,000\ ns = 150\ ms$ |

## Assumptions

- **Daily Active Users(DAU)**: $25\%$ of total users
- **Query Per Second(QPS)**: $\frac{Total\ Queries\ in\ a\ day}{86400\ sec}$
- **Standard Text/ASCII Char**: $1$ Byte per character
- **Unicode/Non-English Text**: $2$ Bytes per character
- **Long / Double / IDs**: $8$ Bytes
- **Average Post**: $250$ characters
- **Averge Image size**: $300$ KB
- **Video**: $3\ MB$ to $4\ MB$ per minute (standard compressed mobile streaming)
- **P50**: Half of your users get response in less than $100ms$ during peak hours
- **P95**: $95\%$ users receive response in under $500ms$ at peak
- **P99**: $99\%$ users receive response in under $1s$ to $2s$ at peak
- **Peak QPS**: $2\ \times$ Avg. QPS

## Minimal Findings

1. Traffic Estimation: QPS, Peak QPS, No. of servers
2. Data Storage: Database type, Daily Storage, Long-Term Storage
3. Network Bandwidth: Ingress (incoming data/sec) and Egress (outgoing data/sec)

> CAP Trade-offs, RAM, Latency are optional

### Additional Notes

- High Read QPS is scales by adding Caching layers (Redis) and Database Read Replicas. Reads are easy to duplicate.

- High Write QPS is scales by adding Message Queues (Kafka), Database Sharding (partitioning), and choosing write-optimized databases (like NoSQL/LSM-tree). Caching does not help with incoming writes.

### Estimate FaceBook QPS and Storage Requirements

**Given assumptions**

- Total users = $1\ Billion$
- Everyday user posts $2$ Images
- Everyday $10\%$ of users upload Images

**Estimated Requirements**

1. $1\ Billion$ total users
2. Daily Active Users = $250\ Million$
3. QPS
   Assume $5:2$ Read-Write ratio
   Read QPS for single user = $ 250\ M$ users $\times\ 5\ reads/day = 1250\ M $ reads

   Write QPS for a user = $250\ M$ users $\times 2\ writes/day = 500\ M$ writes

   Total Queries Per Second = $\frac{1250\ M + 500\ M}{86400} \approx 20\ K$ queries per second
   Peak QPS = $20 \times 2 = 40\ K$ queries per second

4. Storage
   Everyday user makes $2$ posts
   $1$ Post = $250\ chars$ $\times\ 2 $ Bytes $= 500$ Bytes per post
   $2$ Posts = $ 500\ Bytes \times 2 = 1\ KB$ post storage for a user everyday

   Daily Active Users $ = 250\ Million$
   For Posts, $1\ KB \times 250\ M = 250\ GB$
   Everyday $10\%$ of Total users upload Images
   $25\ M$ users upload $300\ KB \times 25\ M = 8\ TB$ Images

   For $5$ years $\approx 2000$ days,
   $250\ GB \times 2000 \approx 500\ TB$ for posts storage
   $8\ TB \times 2000 \approx 16\ PB$ for image storage

5. RAM
   Assumed we cache last 5 posts of each user daily
   $1$ Post $= 500$ Bytes
   $5$ Post $= 3\ KB$ for 1 user

   $3\ KB \times 250\ M = 750\ GB$ RAM daily

6. Latency
   $95\%$ users will receive response under $500\ ms$ per request during peak traffic
   $1$ request = $500\ ms$, hence $2$ request = $1\ s$
   $1$ server has $50$ threads and it has to process $2$ requests in $1s$ = $100$ req/s
   We have fulfill requirement of $20\ K$ QPS

   Total servers needed = $\frac{20,000\ req/s}{100\ req/s}$ = $200$ servers
   For Peak QPS, total $400$ servers required

**CAP Trade-off**: Prioritize Availability over Consistency since we need each request to return a non-error response

### Estimate Twitter QPS and storage requirements

**Given Assumptions**

- $300$ million monthly active users.
- $50\%$ of users use Twitter daily.
- Users post $2$ tweets per day on average.
- $10\%$ of tweets contain media.
- Data is stored for $5$ years.

**Estimated Requirements**

1. DAU
   $300\ Million \times 50\% = 150\ Million$ DAU

2. QPS
   Use standard $20:1$ Read-Write ratio

   Since user writes $2$ tweets/day, reads are $40$ tweets/day
   Total Reads/day = $150\ Million\ req/day \times 40 = 6\ Billion$ for single user
   Read QPS is $\frac{6\ Billion}{86400 sec} = 70\ K$ req/sec

   Total Writes/day = $150\ Million\ req/day \times 2 = 300\ Million$ for single user
   Write QPS is $\frac{300\ Million}{86400 sec} = 3\ K$ req/sec

   Total QPS = $73\ K$ Queries Per Second
   Peak QPS = $150\ K$ Queries Per Second

3. Storage Requirements
   $10\%$ of tweets contain media

   Avg. tweet size (no media) = $8\ Bytes$(ID) + $500\ Bytes$ (250 chars)$ \approx 500 Bytes$
    Storage requirement (no media) = $300\ Million \times 500\ Bytes = 150\ GB$ per day

   Avg. tweet size (with media) = $300\ KB$
   Storage requirement (with media) = $30\ Million \times 300\ KB = 9\ TB $ per day

   For $5$ years, we have $5 * 400 = 2000$ days
   We need $9\ TB \times 2000 = 18\ PB$ storage

**CAP Trade-off**: Sacrifice consistency to ensure availability all servers process request at all times.
