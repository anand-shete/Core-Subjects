# ACID

[ACID properties](https://www.youtube.com/watch?v=GAe5oB742dw) are the non-negotiable safety rules that Relational Databases (like SQL) use to guarantee that data remains accurate, even when things go wrong (like a power outage or a crash)

## Atomicity

A transaction involves multiple steps. Atomicity guarantees that **either every single step succeeds, or none of them do.**

- **The Mechanism**: Databases use a Transaction Log (or Undo Log). If the transaction completes → It writes a `COMMIT` flag. If it crashes halfway → On restart, the database checks the log, sees no `COMMIT`, and reverses (rolls back) any changes made. Example

1. You transfer `$100` to a friend.
2. Debit `$100` from your account.
3. Credit `$100` to their account.

- If the power goes out after step 1 but before step 2, Atomicity ensures the `$100` reappears in your account. The money doesn't just vanish.

## Consistency

The database must strictly follow all defined rules (constraints, cascades, triggers). If a transaction tries to break a rule, the database blocks it. This ensures the **database transitions from one valid state to another valid state**. Example

1. The database has a rule: `Account_Balance >= 0`.
2. You have `$50` but try to transfer `$100`. The database calculates the result would be `-$50`, sees this violates the rule, and aborts the transaction immediately.

> Consistency is the only ACID property that is also the responsibility of the application developer (you must write the rules), whereas the others are handled automatically by the database engine.

## Isolation

Multiple users use databases simultaneously (**concurrency**). Isolation ensures that one person's unfinished transaction is invisible to others. This prevents messy data mix-ups.

### The Three Anomalies

#### 1. Dirty Read

Dirty reads happen when data is changed by another transaction that is **uncommitted**.

- Transaction 1 updates a row but has not committed yet.
- Transaction 2 reads the uncommitted data.
- Transaction 1 crashes and rolls back.
- Transaction 2 just read data that never existed.

#### 2. Non-Repeatable Read

Non-repeatable reads occur when transaction reads same data twice and gets different results each time because another transaction **comitted**.

- Transaction 1 reads a row.
- Transaction 2 updates that exact same row and commits.
- Transaction 1 reads the row again in the same session, and the data has changed.

#### 3. Phantom Read

Transactions re-runs a query and gets different results each time because another transaction **inserts or deletes rows** that matched search criteria.

- Transaction 1 queries a range of rows matching a condition.
- Transaction 2 inserts a brand new row that fits that condition and commits.
- Transaction 1 runs the same query again, and a new phantom row suddenly appears.

### Preventing Anomalies

#### 1. Locking (The Overprotective Security Guard)

The traditional way to prevent anomalies is to make transactions lock the data they are using so nobody else can mess with it. There are two main types of locks:

1. **Shared Locks (Read Locks)**: Many transactions can read the same row at the same time, but nobody can change it until they are all done.
2. **Exclusive Locks (Write Locks)**: Only one transaction can touch the row. No one else can read it, and no one else can write to it. They must wait in line.

> Locks massively slows down your app. If 1,000 users are trying to update things at once, they all queue up, leading to timeouts and lag.

#### 2. Multi Version Concurrency Control

Instead of locking rows and making readers wait for writers, the database creates a new version (snapshot) of the row every time it is modified.

1. **Prevents Dirty Reads**: When Transaction A edits a row, it creates a Draft Version V2. Transaction B comes along to read. The database looks at V2, sees it isn't committed yet, and automatically routes Transaction B to read the old, safe V1 version from the past.
2. **Prevents Non-Repeatable Reads (Repeatable Read Level)**: The moment your transaction starts, the database takes a mental snapshot of the entire database state at that exact millisecond. Even if 100 other users edit and commit changes to those rows, your transaction continues to read from its personal snapshot. Time stands still for you.

> MVCC consumes more storage space (disk and RAM) because the database has to hold onto old versions of rows until old transactions finish. (PostgreSQL has a background process called `VACUUM` that constantly cleans up these dead old versions!).

### Four Isolation Levels

Stricter isolation means fewer errors but slower performance. Below table shows consistency from highest to lowest.

| Isolation Level      | Description                                                       | Possible Anomalies (Yes)                      | Locking Strategy                                                                                                                              |
| -------------------- | ----------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Read Uncommitted** | You can read data currently being edited by someone else.         | Dirty Read, Non-repeatable read, Phantom read | **Read**: No lock aqquired; **Write**: No lock aqquired                                                                                       |
| **Read Committed**   | You can only read data after it is saved. (Default for most DBs). | Non-Repeatable Read, Phantom read             | **Read**: Shared Lock aqquired and released after Read is complete; **Write**: Exclusive Lock aqquired and keep till end of transaction       |
| **Repeatable Read**  | Once you read a row, it stays locked/same for your whole session. | Phantom Read                                  | **Read**: Shared lock aqquired and released at end of transaction; **Write**: Exclusive lock aqquired and released only at end of transaction |
| **Serializable**     | Transactions run one after another, as if in a single line.       | No anomalies, but slow performance            | Same as repeatable read locking strategy + apply range lock and lock is released only at end of the transaction                               |

## Durability

Once the database says Success(commit), that data is saved forever. Even if the server creates a fire or the power plug is pulled 1 millisecond later, the data must survive. Commit in this context is after the database wrote operation to hard disk.

- **Write-Ahead Logging (WAL) Mechanism**: Writing to the hard disk is slow. So, databases first quickly append the change to a log file which is very fast.
- Only after the log is safe on disk, the database confirm Success to the user.
- The actual heavy data tables are updated later in the background. If the power fails, the database reads the WAL on reboot to replay and restore the data. Example:

1. You buy a flight ticket. The screen says Confirmed.
2. The server crashes immediately.
3. When it restarts, your seat is still booked because the transaction log captured it before the crash occurred.

> All these ACID properties applies to a single database instance only.
