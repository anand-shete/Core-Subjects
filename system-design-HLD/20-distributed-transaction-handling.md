## Transaction

A transaction is a single logical unit of work that executes a sequence of data operations completely or not at all.
It ensures that a database moves safely from one consistent state to another, even if system crashes, network failures, or power outages occur midway through.

## ACID Properties

1. **Atomicity**: If any single operation within the transaction fails, the entire transaction is aborted, and previous changes are rolled back.
2. **Consistency**: The database must transition from one valid state to another, maintaining all predefined data rules, constraints, and cascades.
3. **Isolation**: Concurrent transactions must execute without interfering with each other. The system must behave as if transactions are running sequentially.
4. **Durability**: Once a transaction is committed, its changes are permanently written to non-volatile storage and will survive subsequent system crashes.

> Refer to [this](../database-management-system/2-ACID-properties.md) for transactional handling in single database instance.

# Transactional Handling in Distributed Systems

There are three main ways to handle transactions inside a distributed systems.

## Two-Phase Commits

Two-Phase Commit (2PC) is a strong consistency protocol used to achieve atomic transactions across multiple databases or microservices. It contains two key components:

- **Coordinator**: The manager/brain that orchestrates the transaction.
- **Participants** (Cohorts): The individual databases or services executing the local transactions.

### Phase 1: Prepare Phase (The Vote)

1. The Coordinator sends a `Prepare` message to all Participants.
2. Each Participant executes the transaction locally up to the point of committing. It locks the necessary database rows.

3. Each Participant votes:
   - `VOTE_COMMIT` (Yes): If its local execution succeeded and it is ready to commit.
   - `VOTE_ABORT` (No): If something failed (e.g. validation failed, lock timeout).

### Phase 2: Commit Phase (The Execution)

1. Scenario A (Unanimous Yes): If all participants voted `VOTE_COMMIT`, the Coordinator sends a `Commit` message. All participants permanently save the changes and release their database locks.

2. Scenario B (Any No): If even one participant votes `VOTE_ABORT` (or times out), the Coordinator sends a `Rollback` message. All participants undo their local changes and release their locks

### Why 2PC fails at scale

While 2PC provides strong consistency, it is rarely used in high-throughput modern microservices because it is blocking and fragile.

- **The Single Point of Failure** (SPOF): If the Coordinator crashes mid-way through Phase 2 after some nodes received the commit message but others didn't, the cluster is left hanging in limbo.
- **Resource Locking** (Performance Killer): Participants hold database row locks from the start of Phase 1 until the very end of Phase 2. If a network delay occurs, other transactions are blocked, causing massive latency bottlenecks.
- **Network Partition Problem**: If a participant loses network connection during Phase 2, it cannot know whether to commit or abort. It must hold its locks indefinitely until the network heals.

## Three-Phase Commits

### Phase 1: Can-Commit?

- The Coordinator asks all participants: "Are you capable of committing this transaction?"
- Participants check their local resources, acquire database locks, and reply Yes or No.
- Unlike 2PC, they do not execute the transaction yet; they just check if they can.

### Phase 2: Pre-Commit

- If everyone said Yes, the Coordinator sends a `Pre-Commit` message.
- Participants execute the transaction locally (writing to their local transaction logs), but they do not finalize (commit) it yet.
- They reply with an Ack (Acknowledgment) once they are ready.
- The Timeout Rule: If a participant enters this phase but the coordinator crashes and times out, the participant **automatically assumes abort and rolls back**.

### Phase 3: Do-Commit

- Once the Coordinator gets all Acks from Phase 2, it sends the final Do-Commit message.
- All participants permanently write the data to disk and release their database locks.
- The Critical Timeout Rule: If the coordinator crashes during Phase 3, the participants **automatically commit** after a timeout. Why? Because entering Phase 3 proves that every single node successfully completed Phase 2 and is ready.

### Why 3PC is rarely used in real distributed systems

Imagine your network splits into two isolated halves:

1. **Side A**: Coordinator and Node 1.
2. **Side B**: Node 2 and Node 3.

If coordinator receives ACK from all nodes, it officially enters Phase 3 and starts broadcasting the `Do-Commit` message to all nodes.

- Side A might decide to Abort the transaction because the coordinator can't reach Nodes 2 and 3.
- Side B detects a coordinator timeout. Because they were already in the `Pre-Commit` phase, their timeout rule tells them to Automatically Commit.

Now you have data corruption: half your system aborted the transaction, and the other half committed it.

## SAGA Pattern

Instead of trying to execute one giant, all-or-nothing transaction across multiple databases at the exact same time, Saga breaks the work down into a chain of local transactions.

- Each service executes its own local ACID transaction, updates its own database, and then fires a message/event to trigger the next service in line.

### What if a step fails midway?

By the time Service 3 fails, Service 1 and Service 2 have already committed their data to their local databases. We cannot "rollback" a committed transaction.
To fix this, Sagas use **Compensating Transactions**. If a step fails, the Saga must explicitly execute backward-facing actions to undo the changes made by the previous steps. Think of it as a logical undo button.

### The Two Ways to Implement a Saga

There are two primary architectural patterns used to coordinate a Saga: [24]

| Feature       | Choreography Saga (Event-Driven)                                          | Orchestration Saga (Command-Driven)                                                         |
| ------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Coordination  | Decentralized. Services listen to events and react independently.         | Centralized. A dedicated "Orchestrator" service directs traffic.                            |
| Communication | Services broadcast events via a message broker (e.g., Kafka, RabbitMQ).   | The Orchestrator explicitly calls each service via gRPC, REST, or message queues.           |
| Complexity    | Simple for small workflows, but hard to track as more services are added. | Complex to build initially, but highly visible. You can see the whole workflow in one file. |
| Coupling      | Low coupling. Services don't know who comes next in the chain.            | High coupling. The Orchestrator must know about every single service.                       |

### Trade-offs of the Saga Pattern

**Pros**

- High Availability & Performance.
- No database rows are kept locked waiting for network confirmations.
- If a service goes down, the message stays in Kafka until it wakes up.

**Cons**

- Lack of Isolation ("I" in ACID).
- Because steps commit immediately, other concurrent requests can see intermediate data. For example, a user might see their bank balance drop before the ride booking is actually finalized. You have to handle this in your application code (eg. using "Pending" states).

## Summary

- If we want ultimate scale and performance across independent microservices → We use Saga Pattern (Event-driven asynchronous consistency).
- If we absolutely require strict ACID compliance and strong consistency across shards → We offload the problem to a distributed database running 2PC backed by Paxos/Raft consensus.
- Why skip 3PC? → 3PC is largely a theoretical protocol. It is almost never used in real-world production because it breaks during network splits, which are inevitable in cloud environments.
