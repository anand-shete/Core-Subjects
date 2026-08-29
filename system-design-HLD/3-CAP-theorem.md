## CAP Theorem

The CAP Theorem states that a distributed system can deliver at most two out of three guarantees

1. **Consistency** (C): Every client sees the exact same data at same time.
2. **Availability** (A): Every node that receives a request must return a non-error response.
3. **Partition Tolerance** (P): The system operates despite dropped or delayed messages.

> In reality, networks will inevitably fail, making **Partition Tolerance non-negotiable**. Therefore, when a network split occurs, a system design must choose between Consistency or Availability.

### CP vs. AP Trade-Off

| System Type | Core Strategy                                   | Real-World Example              | Trade-off Impact                                       |
| ----------- | ----------------------------------------------- | ------------------------------- | ------------------------------------------------------ |
| CP System   | Prioritises absolute data accuracy over uptime. | Banking Systems, MongoDB, Redis | Rejects writes/reads if nodes cannot sync              |
| AP System   | Prioritises constant uptime over data accuracy. | Social Media app, DynamoDB      | Accepts writes on split nodes, causing temporary drift |

## Consistency

- The **C** in ACID refers to application logic consistency
- The **C** in CAP refers to all nodes seeing the same data at same time

## Eventual Consistency

Eventual consistency is a data consistency model used in distributed systems where data updates are not replicated across all nodes instantly. Instead, the system guarantees that if no new updates are made, **all replicas will eventually synchronize and return the exact same value**.

To achieve consistency across a distributed network, we do not use traditional local locking like Mutexes or Semaphores. Local primitives like mutexes and semaphores only work inside the RAM of a single computer to manage CPU threads. They cannot control threads accross distributed systems.

## Strong Consistency

Strong consistency ensures that once a write succeeds, every subsequent read across any server will return that new value. It acts like a single global machine.

### 1. Distributed Consensus Protocols (Raft or Paxos)

Instead of a local lock, servers elect a Leader.
**The Flow**: All writes must go to the Leader. The Leader proposes the change to all other servers (Followers).
**The Rule**: The Leader will not confirm success to the client until a **quorum** (a strict majority, like 3 out of 5 servers) acknowledges they have saved the data.

### 2. Distributed Transactions (Two-Phase Commit / 2PC)

This functions like a database transaction but stretches across multiple machines using a Coordinator node.

- **Phase 1 (Prepare)**: The coordinator asks all nodes, "Are you ready to commit this data?" Nodes temporarily isolate the resource and reply "Yes" or "No".
- **Phase 2 (Commit)**: If everyone said yes, the coordinator sends a "Commit" command. If even one node says no or fails to reply, the coordinator sends an "Abort" command to everyone.

## Eventual Consistency

Eventual consistency does not care about stopping the world to make sure everyone matches right now. It prioritizes speed, writes data immediately to one node, and cleans up the differences later.

### 1. Background Replication (Asynchronous)

- **Gossip Protocols**: Nodes constantly whisper to random neighbor nodes, passing around the latest updates they have received until the data trickles down to every server in the network.
- **Read Repair**: When a client requests data, the system queries multiple replicas. If it notices Server A has an old version and Server B has a new version, it returns the new version to the user and quietly updates Server A in the background.

### 2. Conflict Resolution Rules

Because nodes accept updates independently, conflicts will happen. The system uses deterministic rules to merge data:

- **Last-Write-Wins (LWW)**: Every write gets a high-precision wall-clock timestamp. If two updates conflict, the one with the newest timestamp overwrites the older one.
- **CRDTs (Conflict-free Replicated Data Types)**: Special mathematical data structures (like those used in Google Docs or Figma) designed so that no matter what order updates arrive at a server, they automatically merge into the exact same correct state without needing a coordinator.
