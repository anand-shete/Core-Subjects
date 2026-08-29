## Database Locks

Locks are used to manage concurrent access to the same data by multiple transactions

| Lock Type                 | Can another Tx get Shared (S)? | Can another Tx get Exclusive (X)? |
| ------------------------- | ------------------------------ | --------------------------------- |
| **Shared (S) / Read**     | Yes                            | No                                |
| **Exclusive (X) / Write** | No                             | No                                |

1. **Shared Locks (S / Read Lock)**
   - Multiple transactions can hold a shared lock on the same resource simultaneously.
   - Blocks other transactions from modifying (writing to) the data until the lock is released.

2. **Exclusive Locks (X / Write Lock)**
   - Only one transaction can hold an exclusive lock on a resource.
   - Blocks all other transactions from both reading (with an S lock) and writing to the data.

## Concurrency Control Strategies

### 1. Optimistic Concurrency Control (OCC)

Assumes conflicts are rare. Transactions read data without acquiring locks, and validate for conflicts right before committing.

- **Mechanism:** Uses version numbers, timestamps, or MVCC (Multi-Version Concurrency Control).
- **Pros:** High concurrency and throughput in read-heavy systems because it avoids locking overhead.
- **Cons:** High overhead (rollback and retry storms) if data conflicts are frequent (write-heavy systems).
- **Deadlocks:** Vastly reduces lock-based deadlocks, though latch/index conflicts can still occur during the final write validation phase.
- **HLD Use Case:** Excellent for distributed systems, web applications with high read-to-write ratios, and document stores.

### 2. Pessimistic Concurrency Control (PCC)

Assumes conflicts are highly likely. Transactions aggressively lock resources upfront to prevent other transactions from modifying them.

- **Mechanism:** Uses explicit database locks (e.g., SQL `SELECT ... FOR UPDATE` or `LOCK TABLES`).
- **Pros:** Guarantees data safety without retries in highly contentious, write-heavy workloads.
- **Cons:** Lower concurrency/throughput. Transactions must queue up waiting for locks to release. Holds onto connection pool resources longer.
- **Deadlocks:** High risk of traditional deadlocks if different transactions attempt to lock the same resources in a different order. Requires deadlock detection algorithms or strict lock timeouts.
- **HLD Use Case:** Used in critical transactional systems (like core banking ledger entries) where a rollback retry loop is too costly or risky.
