## Types of Two Phase Locking (2PL)

1. Basic 2PL
2. Conservative 2PL (Static 2PL)
3. Strict 2PL
4. Rigorous 2PL (Strong Strict 2PL)

## Basic Two Phase Locking

### Phase 1: Growing Phase

- A transaction requests locks from the lock manager.
- The lock manager either grants or denies the lock request (if another incompatible transaction holds it).
- The transaction cannot release any locks during this phase.

### Phase 2: Shrinking Phase

- The transaction releases locks.
- The transaction cannot acquire any new locks or upgrade existing locks.

## Issues with Basic 2PL

### 1. Deadlocks

Occur when two or more transactions are stuck waiting for each other to release mutually required locks.

#### Prevention & Detection Strategies

1. **Timeouts**: If a transaction waits longer than a defined threshold, the scheduler assumes a deadlock or resource starvation and aborts it.
   - Con: Can mistake slow, long-running operations for deadlocks.

2. **Wait-For Graph (WFG) (Detection)**: A directed graph mapping which transactions are waiting on others.
   - If a cycle is detected, a deadlock exists.
   - The scheduler selects a "victim transaction" to abort and roll back based on metrics (e.g., age, cost of rollback, work remaining).

3. **Conservative 2PL (Prevention)**: Eliminates deadlocks by forcing a transaction to declare and acquire _all_ required locks simultaneously at the start. If any single lock is unavailable, none are granted, and the transaction waits.
   - Con: Highly inefficient; severely limits concurrency because it's hard to predict all needed locks upfront.

4. **Timestamp-Based Deadlock Prevention**: Transactions are assigned a unique timestamp when they begin. Older timestamp = Higher priority.
   - **Wait-Die Scheme (Non-preemptive)**:
     - If $T_{old}$ requests a lock held by $T_{young}$, $T_{old}$ is allowed to **wait**.
     - If $T_{young}$ requests a lock held by $T_{old}$, $T_{young}$ **dies** (aborts and retries).
   - **Wound-Wait Scheme (Preemptive)**:
     - If $T_{old}$ requests a lock held by $T_{young}$, $T_{old}$ **wounds** $T_{young}$ (forces it to abort/rollback and release the lock).
     - If $T_{young}$ requests a lock held by $T_{old}$, $T_{young}$ is allowed to **wait**.

### 2. Cascading Aborts

If Transaction A modifies data and releases its lock early (in Basic 2PL's shrinking phase), Transaction B might read that uncommitted data. If Transaction A later aborts, Transaction B must also be aborted. This chain reaction degrades system performance.

#### Prevention Strategies

1. **Strict 2PL**: Holds all **Exclusive (Write) locks** until the end of the transaction (Commit/Abort). Shared (Read) locks can be released early. This prevents reading uncommitted data, entirely eliminating cascading aborts.

2. **Rigorous 2PL (Strong Strict 2PL)**: Holds **all locks** (both Shared and Exclusive) until the very end of the transaction. It features no shrinking phase at all.
   - Con: Lowers concurrency compared to basic 2PL, and deadlocks are still possible (typically resolved using a Wait-For Graph).

   > Rigorous 2PL is the most widely implemented standard in modern enterprise database systems.
