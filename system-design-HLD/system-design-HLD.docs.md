# References

- [Snowflake key concepts](https://docs.snowflake.com/en/user-guide/intro-key-concepts)

## Distributed System

Eventually a Monolith System will become a Single Point of Failure as system grows and handles large amount of data.

A distributed system is a network of independent computers or nodes that collaborate over a network to achieve a shared goal. To users and client applications, these interconnected machines operate together, appearing as a single, unified system.

## Master-Slave Replication

This strategy handles high traffic (specifically, a high volume of read requests).
**Concept**: You have one Master node and multiple Slave (Replica) nodes.
**Rule**: All writes (inserts, updates, deletes) must go to the Master node. The Master then copies that data to the Slave nodes. All reads go to the Slave nodes.
**Use case**: If millions of users are reading timelines at the same time, you can just boot up 10 Slave nodes to handle the traffic.
**Catch**: Replication takes time. If a user posts a comment (written to Master) and refreshes instantly (read from Slave), they might not see it for a split second. This is the Eventual Consistency trade-off you learned in CAP.

## Sharding

Sharding is a method of horizontal scaling where a large database is broken into smaller, independent chunks called "shards" and distributed across multiple physical servers

**Vertical Partitioning**: Split table by **columns** accross multiple database server.
**Horizontal Partitioning** (Sharding): Split table by **rows**. Every server holds the exact same columns, but different rows of data.
**Sharding Key**: It is used to know which server holds which row.

- A master database generally supports **write operations**. A slave database gets copies of the data from the master database and only supports **read operations**.

- All the data-modifying commands like insert, delete, or update must be sent to the master database. Most applications require a much higher ratio of reads to writes; thus, the number of **slave databases is usually higher** than number of master databases.

> Once a database has been sharded across multiple servers, it is hard to perform join operations across database shards. A common workaround is to de-normalize the database (accept duplicates) so that queries can be performed in a single table.

### Sharding strategies

To determine which shard (server) should store a particular piece of data, developers use a sharding key and apply one of these strategies

1. **Range-Based Sharding**: Data is divided into continuous ranges (e.g. IDs `1–1000` go to Shard A, `1001–2000` to Shard B).
2. **Hash-Based Sharding**: A mathematical formula (hash function) is applied to the shard key to distribute data evenly and avoid hotspots where one server is overloaded (e.g. `user_id % 3`).
3. **Directory-Based Sharding**: A lookup table maintains a specific map of which data belongs to which shard, providing high flexibility for moving data around.

## Celebrity Problem (Hotkey Problem)

Sharding works beautifully until one specific shard gets absolutely slammed with traffic while other shards sit idle. This imbalance is called a Hotkey or Skewed Workload.
**The Scenario**: Imagine you shard your database by `celebrity_id`. Shard 4 holds all data for a mega-celebrity like Cristiano Ronaldo. Shard 5 holds data for a local indie musician.
**The Problem**: When Ronaldo posts an update, millions of users read and write to Shard 4 at the exact same second. Shard 4 crashes due to CPU overload, while Shard 5 is completely fine.
**The Fix**: System architects fix this by adding random suffixes to hot keys (e.g. splitting Ronaldo's data into `ronaldo_1`, `ronaldo_2`, `ronaldo_3`) to distribute his traffic across multiple shards, or by aggressively caching that specific data using an in-memory layer like Redis.

## Resharding data

Resharding is the process of altering your sharding scheme when your existing database servers can no longer handle the load, or when you want to shrink your cluster to save costs. There are two primary triggers that force an engineering team to reshard their cluster

1. **Data Growth** (Scale Out): Your existing shard servers are running out of storage space or CPU capacity. You need to add new servers to the cluster to distribute the load.

2. **Uneven Distribution** (Data Skew): Due to poor choice of a sharding key, one shard might grow exponentially faster than others, creating a storage imbalance.

### The Problem with Naive Resharding

If you use a simple modulo hash function like `user_id % N` to distribute your data, where `N` is the number of database shards—resharding becomes an absolute nightmare. When N changes from 3 to 4, almost every single piece of data in your system maps to a completely different shard.

To fix this nightmare, production systems use a technique called Consistent Hashing.

## DoS attack

A Denial-of-Service (DoS) attack is a cybercrime where a malicious actor floods a targeted server, website, or network with overwhelming traffic to disrupt normal operations. This forces the system to crash or slow down, making it entirely unavailable to legitimate users.

## Apache Zookeeper

Apache ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services across large clusters of machines. It is a highly reliable coordination engine for distributed applications to prevent data conflicts and manage cluster state.

## Snowflake

Snowflake is a cloud-based data platform that stores and analyzes large amounts of data. It uses a unique distributed system that separates storage, computing, and management into three distinct layers

## Recovery Time Objective

A Recovery Time Objective (RTO) is the maximum acceptable length of time a system, app, or service can be offline after a breakdown or disaster. It sets a strict time limit for IT teams to fix problems and bring services back to normal before the business suffers too much harm.

## Recovery Point Objective

A Recovery Point Objective (RPO) is the maximum amount of data loss—measured in units of time—that a business can tolerate during an unexpected system failure, disaster, or cyberattack. It defines how fresh or current your backed-up data must be when you restore it.

## Concurrency

Concurrency in distributed systems is the ability of multiple, independent processes across different nodes to execute simultaneously while safely accessing shared resources.

> A High concurrency system can process a large volume of simultaneous requests (reads or writes) without crashing, slowing down, or corrupting data.

## Parallelism

Parallelism in distributed systems is the practice of running multiple tasks at the exact same time across independent computers connected by a network

## Intranet

An intranet is a private, secure computer network used within a single organization to share files, run internal tools, and connect a distributed workforce
