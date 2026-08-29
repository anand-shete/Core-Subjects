## Architecture Pattern

Architectural Patterns dictate how the entire system is organized and **how components interact** with each other.

### Monolithic Architecture

A single, unified codebase where all business logic, data access, and user interfaces are compiled and deployed together.
Single deployment unit tightly coupled.

**Pros**: Easy to develop, test, and deploy initially. Low network latency. It can be scaled to 3 or 4 servers, by duplicating that exact same single unit across multiple machines behind a load balancer.
**Cons**: Hard to scale individual parts. A crash in one component brings down the whole system. Long build times.

### Microservices Architecture

An application split into small, independent services, each running its own process and communicating via lightweight protocols (e.g. `HTTP`).
Decoupled by business capability (e.g., Auth service, Payment service).

**Pros**: Highly scalable. Teams can deploy independently. Fault tolerant.
**Cons**: High monitoring complexity. Complex distributed data consistency (requires patterns like SAGA). Network latency can be high. Transaction Management is difficult (e.g. with multiple database)

### Serverless Architecture

A cloud computing execution model where the cloud provider dynamically manages the allocation of machine resources. You only write code (Functions-as-a-Service e.g. like AWS Lambda)
Scale-to-zero and event-triggered execution.

**Pros**: Zero server management. Automatic, granular scaling. You only pay for exact execution time.
**Cons**: Cold start latency on initial requests. Vendor lock-in. Hard to debug locally. Unsuitable for long-running processes.

### Event-Driven Architecture

A design pattern where decoupled services asynchronous communicate by producing and consuming events (state changes) via a message broker (like Apache Kafka or RabbitMQ).
Highly asynchronous and loosely coupled.

**Pros**: Excellent scalability. Producers don't care who consumes the data. Highly responsive systems.
**Cons**: Hard to trace data flow. Eventual consistency challenges. Risk of duplicate event processing.

### Layered (N-Tier) Architecture

The classic structural pattern where components are organized into horizontal layers, each with a specific role (e.g. Presentation Layer → Business Layer → Data Access Layer).
Separation of concerns via strict dependencies (Layer A only talks to Layer B).

**Pros**: Clean code organization. Easy to assign developers to specific layers. Simpler testing.
**Cons**: Can lead to a monolithic structure. Modifying a feature often requires changing every single layer.

## Microservices Architectural Patterns & Migration Phases

### 1. Decomposition Phase

In this phase, we choose the strategy to split the system.

- **Decompose by Business Capabilities**: Splitting based on organizational functions.
- **Decompose by Subdomain (Domain Driven Development)**: Splitting based on linguistic boundaries and contexts.

### 2. Database Phase

In this phase, we design how data is stored, synchronized, and queried.

- **Shared Database**: A simpler, transitional pattern where services share one data store.
- **Database per Service**: The target state where each service owns its private data store.

### 3. Communication accross services

In this phase, we define how services talk to one another.

- **Synchronous APIs**: Direct point-to-point calls using HTTP/REST or gRPC.
- **Asynchronous Events**: Decoupled messaging using brokers like Apache Kafka or RabbitMQ.

### 4. Integration & Routing

In this phase, we manage external entry points into the system.

- **API Gateway**: Act as a single reverse-proxy entry point for routing, authentication, and rate-limiting.

### 5. Observability

In this phase, we monitor the health of the distributed web.

- **Distributed Tracing & Centralized Logging**: Tracking a request across multiple service hops.
