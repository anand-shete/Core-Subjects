## Advanced Microservices Design Patterns

### Strangler Fig Pattern

Migrate from Monolith to Microservices safely and incrementally.

- Intercepts traffic at the **Routing Layer** and dynamically alters routes over time to migrate to microservices.
- Eventually, the monolith has no traffic left and is removed.

### SAGA Pattern

Manages data consistency and transactions across multiple databases.

- Uses a chain of local transactions and compensating transactions to undo failures via **events**.
- Example: A user books a trip. The system successfully charges the credit card (Transaction 1) but fails to reserve the hotel room (Transaction 2). The SAGA orchestrator then triggers a compensating transaction to automatically refund the credit card.

#### Types of SAGA

1. **Choreography**: Use message events. Cyclic dependency can cause issues.
2. **Orchestration**: Orchestrator will call different databases to co-ordinate centrally.

### Command Query Responsibility Segregation (CQRS)

Optimizes complex read and write operations accross multiple services. Split application accross two parts:

1. Commands (Writes) modifies data (Create, Update, Delete). Optimised for fast validation and business logic.
2. Queries (Reads) Fetches data. Optimised for blazing-fast search and retrieval.

Separates data modification models from data reading models.

> Because the write database and read database are separate, they sync via an asynchronous **event bus** (like Apache Kafka) to attain Eventual Consistency. Hence, Read database might be a few milliseconds behind the write database.
