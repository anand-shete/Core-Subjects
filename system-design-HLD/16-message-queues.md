## Message Queues

A message queue is a software tool that allows asynchronous communication between decoupled components in a distributed system.

- **Producers**: Applications that create and send data.
- **Consumers**: Applications that read and process data.
- **Queue/Buffer**: A temporary storage mechanism that holds messages reliably until consumers are ready to process them.

## Why do we need Queues?

1. **Load Leveling (Buffering)**: If your website encounters a massive traffic spike, your backend servers might crash. A message queue acts as a structural shock absorber, holding millions of incoming tasks so your consumers can pull and process them at safe pace.
2. **Decoupling**: Service A does not need to know anything about Service B. If Service B goes offline for updates, Service A can still successfully push tasks to the queue and keep working without throwing errors to the end-user
3. **Asynchronous Processing**: Decoupled systems can hand off data without waiting for an immediate response, allowing for automatic retry capabilities if a downstream system is offline.

## Design Patterns

Message brokers generally handle communication in two fundamental ways:

### 1. Point 2 Point

One message is targeted to exactly one consumer. Once a consumer pulls it, the message disappears.
**Competing Consumers Pattern**: Multiple consumers read from one queue to balance processing loads, but they never process the exact same message.

> Best used for Task distribution (e.g., video transcoding, processing an order payment).

### 2. Publish/Subscribe Queue

A producer broadcasts a message to a "Topic" instead of a queue. Every downstream service subscribed to that topic gets its own copy.

One producer sends a message, and multiple independent consumers (or subscriber groups) all receive their own copy of that exact same message.
Example: A user places an order. The "Order Placed" message is published once, but both the Shipping Service and the Invoice Service need to receive it to do their respective jobs

> Best used for Broadcasting system events (e.g., a user registers, so the marketing service, analytics service, and notification service all react simultaneously).

## Replication

Data is copied across multiple **Brokers** within a cluster to prevent data loss if a single machine crashes.

- **RabbitMQ**: Uses Quorum Queues (replicated via the Raft consensus algorithm).
- **Kafka**: Uses Partition Replicas with an In-Sync Replicas (ISR) model.

## Dead Letter Queue

A specialized queue where messages are sent when they fail processing after max retry attempts, expire due to Time-To-Live (TTL), or are explicitly rejected by a consumer due to malformed data.

## Most Popular Message Queue Services

1. **Open-Source & Self-Hosted Heavyweights**: RabbitMQ, Apache Kafka, NATS, Apache ActiveMQ
2. **Fully Managed Cloud Offerings (Zero-Ops)**: Amazon SQS, Azure Service Bus, Google Cloud Pub/Sub
3. **Lightweight Alternatives (Leveraging Existing Tech)**: Redis streams (Pub/Sub)

## Backpressure Handling

Backpressure is needed to prevent queue from growing infinitely (e.g. in case of fast producer and slow consumer).

1. Queue reaches a specific threshold (e.g., 50,000 pending items)
2. Broker forces the upstream producers to slow down or reject incoming user requests.

## RabbitMQ vs Kafka

| Feature          | RabbitMQ                                                              | Kafka                                                                  |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Data Delivery    | Push-based (Broker pushes to consumer)                                | Pull-based (Consumers poll the broker)                                 |
| Smart/Dumb       | Smart broker, dumb consumer (Broker tracks state/delivery)            | Dumb broker, smart consumer (Consumer tracks its own offset)           |
| Coordination     | Erlang/Raft as Internal coordinator                                   | KRaft (Native consensus)                                               |
| Message Lifespan | Transient; deleted once consumed and acknowledged                     | Log-centric; persists based on time/size policy                        |
| Storage Strategy | RAM-First, Disk-Backed; stores in memory, flushes to disk to save RAM | Disk-First; writes instantly to sequential disk logs, reads from cache |
| Routing          | Complex/Flexible; routing keys, headers, fanout exchanges             | Basic; topics and partition key hashing                                |
| Throughput       | High (Thousands of messages/sec)                                      | Ultra-High (Millions of messages/sec)                                  |

## RabbitMQ - Types of Exchange

1. **Fan-out Exchange**: Ignores routing keys. Publicizes duplicates of the message to every single queue bound to it (classic Pub/Sub).
2. **Direct Exchange**: Routes messages based on an exact match between the message routing key and the queue binding key.
3. **Topic Exchange**: Routes messages based on wildcard matching between routing keys and patterns (`*` matches exactly one word, `#` matches zero or more words).
4. **Headers Exchange**: Ignores routing keys entirely; routes based on attributes defined in the message header metadata.

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

## Questions to ask before choosing a message broker

1. Do I care about the past?

- **No (Transient)**: Once a job is completed, it should disappear forever. I only care about the current workload (e.g., sending an email, processing a payment). Use traditional Queues (RabbitMQ, AWS SQS, BullMQ).

- **Yes (Log/Stream)**: I need to store a history of events. I might want to clear my database and re-read all messages from last week to rebuild my data state or run analytics. Use Event Streams (Apache Kafka).

2. Who should decide where the message goes?

- **The Infrastructure (Smart Broker)**: I want the broker to handle complex conditional routing logic (e.g., "If message comes from a mobile app and is an error, route to the urgent queue"). Use RabbitMQ (via its powerful AMQP Exchange mechanics).
- **The Application (Smart Consumer)**: The broker should just be a lightning-fast pipeline. My applications down the line will pull the raw data stream and filter out what they need themselves. Use Kafka or cloud options like AWS Kinesis.

3. What is my scale and resource footprint?

- **High Throughput / Low Latency (RAM heavy)**: I have a Node.js stack, a few background tasks, and I already have a Redis server running. Use BullMQ. It is zero-ops overhead because you don't need a new server cluster.

- **Infinite Scale (Cloud Managed)**: I don't want to think about RAM, disks, clustering, or maintenance at all. I just want an API I can send messages to. Use AWS SQS (Point-to-point, behaves conceptually like a managed RabbitMQ) or AWS SNS / Cloud Pub/Sub (for Pub/Sub broadcasting).
