## Process

Process is a heavy, isolated program currently running in execution (e.g. Google Chrome browser application).

## Thread

A lightweight execution unit inside a process (e.g. a single browser tab rendering an animation)

### Shared between Threads

Every thread spawned inside a process shares the exact same resource pool. This includes:

- **Text (Code) Segment**: The compiled instructions running on the machine.
- **Data Segment**: Global variables and static elements.
- **Heap memory**: Dynamically allocated. All threads can read and write to a massive object or array inside heap.

### Isolated between Threads

Threads are not completely identical. Each thread must keep track of its own immediate work

- **Stack memory**: Stores local variables, function parameters, and the return address of method calls.
- **Program Counter (PC)**: A pointer tracking exactly which line of code that specific thread is executing right now.
- **Registers**: Small, lightning-fast CPU storage holding values currently being calculated by that specific thread.

## Context Switching

To make your computer look like it is multitasking, the OS rapidly swaps processes in and out of the CPU. This swap is called a Context Switch.

### Context Switching: Step by step

When the OS decides to pause Process `A` and load Process `B`:

1. **Save State**: The OS saves the current state (Registers, Program Counter) of Process `A` into a data structure called the **Process Control Block** (PCB).
2. **Load State**: The OS fetches the PCB of Process `B` and loads its saved registers and Program Counter back into the CPU hardware.
3. **Resume**: The CPU continues running Process `B` from exactly where it left off.

## Scheduling Algorithms

A CPU scheduling algorithm in an operating system is a set of rules and logic used to determine which process gets to use the CPU at any given time. Key metrics used are:

- **Arrival Time** (AT): When the process enters the ready queue.
- **Burst Time** (BT): The actual CPU time the process needs to finish executing.
- **Turnaround Time** (TAT): Total time from arrival to completion. (Completion Time - Arrival Time).
- **Waiting Time** (WT): Total time the process spent sitting idle in the queue. (Turnaround Time - Burst Time)
- **Non-preemptive**: Process cannot be interrupted until completion or wait state. E.g. `FCFC`, `SJF`.
- **Preemptive**: Process can be interrupted to run a higher-priority or time-sliced process. E.g. `RR`

### 1. First-Come, First-Served (FCFS)

First process to arrive gets executed until it finishes.
**The Flaw (Convoy Effect)**: If a massive, slow process arrives first, all the tiny, lightning-fast processes behind it get stuck waiting. Your system feels laggy.

### 2. Shortest Job First (SJF)

The OS picks the process with the smallest Burst Time first until it finishes.
**The Flaw (Starvation)**: It yields the absolute lowest average waiting time, but it is impossible to perfectly predict the future burst time of a live application. Furthermore, if tiny processes keep arriving continuously, long processes will starve and never execute.

### 3. Round Robin (RR)

Every process gets a tiny fixed slice of CPU time called a **Time Quantum** (e.g. 2ms). Once time is up, the process is forcefully kicked out (Preemptive) and sent to the back of the line.
**Large Time Quantum**: If the Time Quantum is too large, Round Robin degenerates into FCFS.
**Small Time Quantum**: If the Time Quantum is too small, CPU spends all its time context switching instead of executing code, destroying performance.

## Concurrency in OS

Concurrency is the ability of the operating system to **execute multiple tasks or processes simultaneously** even possible on a single core processor through context switching.

## Parallelism in OS

Parallelism in operating system means **execute task parallelly using multi-core** at same instant.
