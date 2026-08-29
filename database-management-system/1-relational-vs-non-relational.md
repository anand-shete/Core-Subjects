## Database Management Systems

A Database Management System (DBMS) is a software system used to store, organize, retrieve, and manipulate data within a database. It serves as a secure bridge between raw databases and end-users or applications, ensuring efficient, centralized control and high-performance data access.

### Relational Database

A relational database organizes data into tables of rows and columns, where distinct tables are linked (or related) using unique identifiers.

### Non-Relational Database

A non-relational database (NoSQL database) stores data in flexible, non-tabular formats like documents, key-value pairs, or graphs.

> Relational (SQL) databases are best for **structured data with defined schema and complex relationships** (like banking systems), while Non-Relational (NoSQL) databases excel at handling **flexible, unstructured data and high-speed scaling** (like social media feeds or real-time caching).

## SQL vs No-SQL

| Feature     | Relational (SQL)                                 | Non-Relational (NoSQL)                     |
| ----------- | ------------------------------------------------ | ------------------------------------------ |
| Data Model  | Tables with Rows & Columns                       | Documents, Key-Values, Graphs              |
| Schema      | Rigid: Must define structure first               | Flexible: No predefined structure          |
| Scaling     | Vertical: Add more power (CPU/RAM) to one server | Horizontal: Add more servers (nodes)       |
| Consistency | ACID: All-or-nothing transactions                | BASE: Eventual consistency (usually)       |
| Best For    | Complex queries, Reporting, Data integrity       | Rapid growth, Big Data, Content management |
| Examples    | PostgreSQL, MySQL, Oracle                        | MongoDB, Redis, Cassandra                  |

## SQL Databases

Relational databases are **used when data is predictable, structured, and integrity is critical**. These systems are built on ACID properties (Atomicity, Consistency, Isolation, Durability), guaranteeing that transactions are processed reliably. Examples

- **Financial Systems**: You need to ensure money subtracted from Account A is added to Account B. If the power fails halfway, the transaction must roll back completely.
- **Complex Relationships**: If you need to join multiple tables (e.g. Customers joined with Orders joined with Products), SQL handles this efficiently.
- **Standard Compliance**: When strict data accuracy and valid schemas are legally required (e.g. healthcare records).

## NoSQL Databases

NoSQL databases are designed for speed, flexibility, and scale. They are often schema-less, meaning you can store data without defining it first.

### Document Databases

Best for storing data that comes in different shapes and sizes. E.g. **MongoDB**

- **Content Management**: Storing blog posts where one post has a video, another has images, and a third has just text.
- **Catalogs**: Product pages where Shoes have sizes/colors but Laptops have CPU/RAM specs. You don't need a massive table with empty columns for every possible attribute.
- **Rapid Prototyping**: When you are building a startup and your data model changes every day.

### Key-Value Stores

Best for high-speed lookups where complex querying isn't needed. E.g. **Redis**

- **Caching**: Storing the result of a slow database query in memory so the next user gets it instantly.
- **Session Management**: Is user logged in? (Key: SessionID, Value: UserData).
- **Real-time Leaderboards**: Storing game scores that update thousands of times per second.

## Decision Metrics

- Do you need to store money or sensitive transactions? → Use PostgreSQL/MySQL (SQL).
- Is your data highly connected (e.g., a social network graph)? → Use PostgreSQL or a Graph DB.
- Is your data strict (e.g., employee records with tax IDs)? → Use SQL.
- Are you storing massive amounts of logs, sensor data, or feeds? → Use MongoDB (NoSQL).
- Do you need sub-millisecond access for real-time features? → Use Redis (NoSQL).
