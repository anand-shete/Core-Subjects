# Rate Limiter

A rate limiter in a distributed system is a control mechanism that limits the number of requests a user, service, or IP address can make within a specific timeframe.

## Algorithms for Rate Limiting

1. Token Bucket
2. Leaky Bucket
3. Fixed Window Counter
4. Sliding Window Log
5. Sliding Window Counter

### Token Bucket

Capacity of bucket to hold tokens

After req comes, is there a token present in bucket?

- If yes, each request comsumes a token
- If no token, request will be deined

Refill is calculated lazily on-demand when a request arrives using formula
$Current\ Tokens = Min(Maxiimum\ Capacity, Last\ Tokens + (Current\ Timestamp - Last\ Timestamp) \times Refill\ Rate)$

E.g. Configurable token bucket
Max_Capacity = 3 tokens
Refill_Rate = 2 tokens per minute (or 0.033 tokens per second)

1. For each user, 3 tokens avaiable per minute to post tweets.
2. Refiller fills 2 tokens in 1 minute. Extra tokens overflow from bucket after max capacity reached.
3. If counter for a user reaches 0, tokens are refilled on-demand. Repeat the process

### Leaky Bucket

Bucket has fixed capacity.
Request are processed at constant rate.

If incoming req are more than what can be processed, the excess requests are denied

Leaky bucket implemented using a Queue

- If queue not full, add to bucket and process each request using FIFO principle
- If queue is full, incoming request are denied with status code `429` (Too many request)

Disadvantage: Increased latency for bursty traffic because requests are forced to wait in the queue even if the system has the idle capacity to process them immediately.

### Fixed Window Counter

Fixed window (e.g. 5 minute) is created and each window has a counter (e.g. 3)

- For each window, if request comes in window, counter for that window is decrement by 1

- If counter reaches 0, incoming request will not be processed

Cons: If request comnes at end of current window and start of next window, we may process high number of request than the counter value.

### Sliding Window Logs

Similar to fixed window but we maintain logs of accepted requests timestamps.

1. When a new request arrives, you fetch all timestamps from the last window (e.g., last 60 seconds)
2. Drop older timestamps
3. Count the remaining log entries to decide if the new request should be accepted

### Sliding Window Counter

It is a memory-efficient hybrid that uses two adjacent fixed windows (the previous window and the current window). It approximates the request count using a mathematical percentage based on the current time offset.

Example:
If a request arrives 30% into the current 1-minute window, the algorithm calculates:
$Requests = (Previous\ Count\ \times 70\%) + Current\ Window\ Count$
This eliminates the memory bloat of saving timestamps (logs) entirely

## Distributed System Challenges

- **Race Conditions**: Two servers checking the same user counter at the exact same millisecond can cause "double counting" errors. Systems use Redis, locks or Lua scripts to ensure operations are atomic.
- **Inconsistent Clocks**: Servers in a distributed network can experience clock drift. Systems must sync time precisely or rely on a single central clock source.
- **Increased Latency**: Checking a central database for every single request adds a network hop. Engineers use centralized redis cache server
