# Main Topics

- **Scalability**: Achieved through incremental scalability, allowing the system to scale out one node at a time.
- **Decentralization**: The system is completely decentralized with no single point of failure; all nodes are symmetrical and have the same set of responsibilities.
- **Eventual Consistency**: High availability is prioritized over strong consistency, often pushing conflict resolution to the application layer

## Partition

Partitioning uses Consistent Hashing to distribute data across nodes. A physical server may occupy multiple positions on the ring (virtual nodes) to ensure even distribution

## Replica

Number of replicas are (N = 3) by default but they can be configured

### Quorum Rule

$W + R > N$

To maintain consistency, the sum of nodes acknowledging a write $W$ and nodes responding to a read $R$ must exceed the replication factor $N$.

- Fast Reads ($R=1, W=N$): You only ask one node for data (low latency), but every single node must acknowledge a write before it's "done" (high write latency).
- Fast Writes ($W=1, R=N$): You write to one node and move on, but to be sure you have the latest data, you have to query every node in the cluster.
- Balanced (Typical): $N=3, W=2, R=2$. This is the "sweet spot" for many systems, allowing for one node failure while maintaining strong consistency.

> Lowering $W$ or $R$ = Better performance (less waiting) but higher risk of reading "stale" (old) data.  
> Increasing $W$ or $R$ = Better data integrity but higher latency and lower availability if nodes go down.

### Preference List

- Preference List is a list of physical nodes responsible for storing a specific key
- All nodes are aware of the ring membership and placement information.

## Get and Put operation

### Load Balancer

Generic Load Balancer: Client sends a request to any node, which then acts as a coordinator by routing to the correct replica (may involve a network "hop")

Partition-Aware Load Balancer: Client/Load balancer is aware of the ring and routes directly to the coordinator node, eliminating the extra hop.

## Data Versoning

### Vector clock

A list of `[server, counter]` pairs used to capture causality between different versions of an object.

### Conflict Resolution

**Application-Specific**: When vector clocks detect a conflict (concurrent writes), the server returns all versions (siblings) to the client, which merges them (e.g., merging shopping cart items).
**Last-Write-Wins (LWW)**: A simpler server-side resolution based on wall-clock timestamps where the most recent timestamp is kept and others are discarded.

## Gossip Protocol

A peer-to-peer communication mechanism where nodes periodically exchange heartbeat counters with random neighbors to maintain an eventually consistent view of the cluster membership.

- A node is marked "down" only after multiple nodes confirm its heartbeat hasn't increased for a threshold period.

## Merkle Tree

Merkle Trees are a hierarchical data structure where "leaf" nodes are hashes of individual data blocks (keys/values), and non-leaf nodes are cryptographic hashes of their child nodes.

Used for **anti-entropy** (background replica synchronization) to detect inconsistencies between replicas faster while minimizing the amount of data transferred.

- Used for background synchronization between replicas.
- It update the servers which does not hold the updated data.
