## SQL

- Tabular structure
- Centralized database
- SQL scales well vertically
- ACID compliance for Data Integrity

## No-SQL

- Structure:
  - Key-value database: Only query by keys
  - Document Datbase: Query by both keys and value
  - Column-wise DB: For each key, we have dynamic no. of columns
  - Graph DB: Data is stored as interconnected nodes (entities) and edges (relationships)
- Distributed (De-centralized)
- No-SQL scales horizontally
- BASE (BAsically available, Safe state, Eventual Consistency)

## When to use SQL?

- SQL databases support complex queries, multi-table joins
- Schema already known
- Strong relationship between data
- Data Integrity or Consistency is High priority (Financial Institutions)
- Distributed SQL have Consistency and Partition Tolerance according to CAP theorem

## When to use No-SQL?

- No fixed schema
- High scalability
- High Availability
- High Query performace
- CP: MongoDB, Key-value stores
- AP: Graph databases, DynamoDB,

### Why MongoDB prioritize CP by default ?

MongoDB uses a Single-Leader replication model.

One master node handles all writes, and secondary nodes replicate the data. If a network partition cuts off the master node, the remaining nodes instantly stop accepting writes and force an election to choose a new leader. During those few seconds of election time, the database is unavailable to ensure your data stays perfectly consistent.

### SQL Limitations

- SQL struggles with a peak of 70,000 write QPS and 1.6 Petabytes of relational data without massive, complex sharding.
