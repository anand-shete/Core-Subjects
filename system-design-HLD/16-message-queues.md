## Message Queues

A message queue is a software tool that allows asynchronous communication between decoupled components in a distributed system.

- **Producers**: Applications that create and send data.
- **Consumers**: Applications that read and process data.
- **Queue/Buffer**: A temporary storage mechanism that holds messages reliably until consumers are ready to process them.

## Why do we need them

1. **Asynchronous Processing**: Decoupled systems can hand off data without waiting for an immediate response, allowing for automatic retry capabilities if a downstream system is offline.
2. **Load Leveling (Buffering)**: Protects a slow consumer from being overwhelmed by a fast producer by holding spike traffic safely in the queue.
3. **Decoupling**: The producer does not need to know who the consumer is, what language it is written in, or if it is currently running.

### Point 2 Point

Each message is processed only once by exactly one consumer.
**Competing Consumers Pattern**: Multiple consumers read from one queue to balance processing loads, but they never process the exact same message.

### Pub/Sub Message

One producer sends a message, and multiple independent consumers (or subscriber groups) all receive their own copy of that exact same message.
Example: A user places an order. The "Order Placed" message is published once, but both the Shipping Service and the Invoice Service need to receive it to do their respective jobs

## Replication

Data is copied across multiple **Brokers** within a cluster to prevent data loss if a single machine crashes.

- **RabbitMQ**: Uses Quorum Queues (replicated via the Raft consensus algorithm).
- **Kafka**: Uses Partition Replicas with an In-Sync Replicas (ISR) model.

## Dead Letter Queue

A specialized queue where messages are sent when they cannot be processed.
Messages are sent to Dead Letter Queue if they fail processing after max retry attempts, expire due to Time-To-Live (TTL), or are explicitly rejected by a consumer due to malformed data.

### RabbitMQ - Types of Exchange

1. **Fan-out Exchange**: Ignores routing keys. Publicizes duplicates of the message to every single queue bound to it (classic Pub/Sub).
2. **Direct Exchange**: Routes messages based on an exact match between the message routing key and the queue binding key.
3. **Topic Exchange**: Routes messages based on wildcard matching between routing keys and patterns (`*` matches exactly one word, `#` matches zero or more words).
4. **Headers Exchange**: Ignores routing keys entirely; routes based on attributes defined in the message header metadata.

## RabbitMQ vs Kafka

| Feature              | RabbitMQ                                                   | Kafka                                                                       |
| :------------------- | :--------------------------------------------------------- | :-------------------------------------------------------------------------- |
| **Data Delivery**    | Push-based approach (Broker pushes to consumer)            | Pull-based approach (Consumers poll the broker)                             |
| **Smart/Dumb**       | Smart broker, dumb consumer (Broker tracks state/delivery) | Dumb broker, smart consumer (Consumer tracks its own offset index)          |
| **Coordination**     | Erlang/Raft as Internal coordinator                        | KRaft / Apache ZooKeeper (removed in v4.0)                                  |
| **Message Lifespan** | Messages are deleted once consumed and acknowledged        | Log-centric; messages persist on disk based on a time/size retention policy |

## Follow Ups

Q. If RabbitMQ uses a push-based approach, how does it prevent a fast broker from overwhelming a slow consumer? How does Kafka handle this differently?

- RabbitMQ uses Prefetch Limits (QoS). The consumer tells the broker, "Only push N unacknowledged messages to me at a time." Once that limit is reached, the broker stops pushing and buffers data on disk/RAM until the consumer sends an ACK.
- Kafka avoids this entirely because it is pull-based. The consumer controls the pace by explicitly requesting (polling) only as many messages as it can handle.

Q. What is the difference between a message queue (RabbitMQ) and a distributed commit log (Kafka) regarding message retention after consumption?

- RabbitMQ is a transient queue. Once a message is consumed and acknowledged (ACK), it is permanently deleted from the broker. You cannot easily re-read past data.
- Kafka is an append-only log. Messages are persisted to disk and kept even after consumption. They are only deleted when a retention time (e.g., 7 days) or size limit is reached. This allows multiple different consumer groups to replay the exact same historical data from the beginning.

Q. How do RabbitMQ and Kafka handle scaling out horizontally when you have a massive spike in traffic?

- You scale by adding more Competing Consumers to a single queue. RabbitMQ will round-robin the messages across available consumers.
- You scale via Partitions and Consumer Groups. A topic is split into multiple parallel partitions. If you want to scale to 5 parallel consumers, your Kafka topic must have at least 5 partitions, because only one consumer in a group can read from a single partition at a time.
