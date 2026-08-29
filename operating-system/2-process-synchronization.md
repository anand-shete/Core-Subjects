## Process Synchronization

When multiple threads try to run concurrently or in parallel, they inevitably cross paths. This is where things break.

### Race Condition

A Race Condition is an undesirable situation where the output of a program depends on the unpredictable sequence of uncontrollable execution events. E.g. If two users try to buy the absolute last remaining item in your inventory at the exact same millisecond, you may oversell your inventory due to Context switching

### Critical Section Problem

The section of code where shared resources are accessed and mutated is called the Critical Section. To prevent data corruption, any solution to the Critical Section problem must satisfy three strict rules:

1. **Mutual Exclusion**: If Thread A is executing inside the critical section, other threads must wait for execution.
2. **Progress**: If no thread is executing in the critical section, and some threads want to enter, only those threads can participate in deciding who gets to go next. The decision cannot be postponed indefinitely.
3. **Bounded Waiting**: There must be a limit on how many times other threads can cut the line to enter the critical section after a thread has requested access. This prevents a thread from waiting forever (Starvation).

> Mutex and semaphores are synchronization tools provided by Operating Systems to prevent race conditions and data corruption.

## Mutex

MUTual EXclusion lock is a **ownership based locking mechanism**. It works as follows:

1. A thread wants to update a shared variable (e.g., account balance). It must first acquire the Mutex lock.
2. If the lock is free, the thread takes ownership of the key and enters the critical section.
3. Any other thread trying to get the lock is forced to go to sleep by the OS.
4. When the first thread is completely finished, it unlocks the Mutex, passing the key back to the OS.

> Only the thread that locked the Mutex can unlock it. You cannot have Thread B forcefully steal or release a lock held by Thread A.

## Semaphore

Semaphore is a **counter based signalling system**. It does not have ownership.

1. It initializes with an integer value (e.g. `count = 3`).
2. Wait (`P` operation): When a thread wants a resource, it executes a wait operation which decrements the count by 1. If the count goes below 0, the thread blocks and waits.
3. Signal (`V` operation): When a thread is done with a resource, it executes a signal operation which increments the count by 1 and wakes up a sleeping thread.

> Any thread can signal a semaphore. Thread A can decrement the counter to block access, and an entirely separate background. Thread B can increment it later to open the gates back up.

## Deadlock

Deadlock is a state in an operating system where two or more processes are stuck forever because each is waiting for a resource held by another.

### The 4 Coffman Conditions

For a deadlock to occur, these four conditions must **occur simultaneously**.

1. **Mutual Exclusion**: Only one thread can use a resource at a time.
2. **Hold and Wait**: A thread holding allocated resources can request additional resources without giving up its current ones.
3. **No Preemption**: Resources cannot be forcibly taken from a thread.
4. **Circular Wait**: A closed chain of threads exists, where each thread waits for a resource held by the next.

> Deadlock Prevention works by designing the system so that at least one of the 4 Coffman conditions is impossible to meet.

## Deadlock vs. Starvation

Starvation in an operating system (also called indefinite blocking) occurs when a low-priority process is perpetually denied necessary resources (like CPU time or memory) because higher-priority processes continuously monopolize the system.

| Feature      | Deadlock                                                          | Starvation                                                                                                               |
| ------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Definition   | Two or more threads are completely frozen, waiting on each other. | A thread is ready to run, but is perpetually ignored because other threads keep getting priority.                        |
| Thread State | Blocked. The threads are actively stuck in a waiting queue.       | Ready. The thread is capable of running, but the OS scheduler chooses others.                                            |
| System State | The affected threads make zero progress forever.                  | The overall system is working fine, but one specific thread is left hungry.                                              |
| Example      | Alice holds the Pen, Bob holds the Paper. Absolute freeze.        | A low-priority writer thread waits for the Pen, but the OS keeps giving the Pen to high-priority threads arriving later. |

## Synchronization Problems

### Producer-Consumer Problem (Bounded Buffer)

This is the most common problem you will encounter in real-world engineering (it is how message queues like Kafka and thread pools work).

**The Setup**: Producers generate data and put it into a fixed-size buffer. Consumers take data out of that buffer to process it.

The core challenge:

1. **Data Corruption**: Multiple producers/consumers trying to modify the buffer at the exact same time.
2. **Buffer Overflow**: A producer trying to add data when the buffer is completely full.
3. **Buffer Underflow**: A consumer trying to grab data when the buffer is completely empty

The Interview Solution is to use three synchronization tools:

- A **Mutex/Lock** to ensure only one thread modifies the buffer at a time.
- A counting semaphore `empty_slots` (initialized to Buffer Size) to block producers if the buffer is full.
- A counting semaphore `full_slots` (initialized to 0) to block consumers if the buffer is empty

### Dining Philosophers Problem

This is a purely theoretical problem used to test your ability to spot and resolve Deadlocks.

**The Setup**: Five philosophers sit around a circular table. They alternate between thinking and eating. To eat, a philosopher must pick up both their left fork and their right fork.

**The Core Challenge (The Deadlock)**: If every philosopher sits down and simultaneously picks up their left fork, all right forks are taken. Every philosopher is now holding one fork, waiting forever for the next person to drop theirs. This is an example of Circular Wait.

The Interview Fixes (How to break the deadlock):

- **Asymmetric Rule**: Make even-numbered philosophers pick up their left fork first, and odd-numbered philosophers pick up their right fork first. If a philospher cannot pick up his left fork, he must put down his right fork and wait.
- **Resource Ordering**: Assign a number (1 to 5) to the forks. Force every philosopher to always pick up the lower-numbered fork first. Philosopher 5 would have to reach for Fork 1 before Fork 5, breaking the deadlocked chain.
