## Virtual Memory

Virtual memory is a memory management technique that creates the illusion of a vast, contiguous block of main memory. It allows an operating system (OS) to run large applications or multiple programs simultaneously by temporarily offloading inactive data from physical RAM to secondary storage (like a hard drive or SSD).

## Paging

Paging is a technique where memory is divided into small, fixed-size blocks called pages. If RAM gets full, the OS moves inactive or background pages to a designated storage space (often called a **swap file** or page file).

- Virtual memory is divided into fixed size blocks called Pages.
- Phyical memory is divided into fixed size blocks called Frames.

## Page Table

Page Table is a per-process data structure that **maps Virtual Page Numbers to Physical Frame Numbers**. The Memory Management Unit (MMU) uses this table to translate virtual addresses into physical hardware addresses.

Example: Opening a Massive 100GB Open-World Video GameImagine playing a massive game like Grand Theft Auto or Cyberpunk.

Let's say computer has 16GB of RAM, but the game is 100GB.

- **The Scenario**: When you launch the game, the OS does not load all 100GB into RAM (it physically cannot). It only loads the main menu code.
- **The Page Fault**: You click "Load Game" and spawn into a specific city block. As your character turns a corner, the game engine tries to render a highly detailed 3D model of a skyscraper.
- **What Happens**: The CPU looks for the skyscraper's texture data in RAM. It’s not there. A page fault occurs. The OS pauses the game for a microsecond, rushes to your fast SSD, grabs the skyscraper texture, throws it into RAM, and the game continues

## Page Fault

A page fault is an **interrupt** triggered by Memory Management Unit (MMU) when a program attempts to access data or code that is in its virtual memory address space but is not currently loaded into physical memory (RAM).

### Resolution

1. The OS halts the program, checks the disks for where that missing page lives.
2. Copies (swaps) the page from the disk into free frame inside RAM.
3. The OS updates the page table to mark this page as valid in memory and restarts the interrupted instruction.

## Page Replacement Algorithms

When a page fault happens but RAM is completely full, the OS has to evict (swap out) an existing page to the disk to make room for the new one. To decide which page gets kicked out, the OS uses Page Replacement Algorithms

### First-In-First-Out (FIFO)

The OS replaces the page that was brought into memory the longest time ago.
**Pro**: Easy to implement.
**Con**: Can accidentally kick out heavily used pages. This leads to **Belady's Anomaly** (where giving a process more memory actually increases page faults).

### Least Recently Used (LRU)

The OS tracks the last time each page was referenced and evicts the page that hasn't been touched in the longest period.
**Pro**: Excellent real-world performance because it exploits temporal locality (pages used recently will likely be used again).
**Con**: Requires hardware support to track timestamps or page references, adding complexity.

### Optimal Page Replacement (OPT or MIN)

Replaces the page that will not be used for the longest time in the future.
**Pro**: Mathematically guarantees the lowest possible page fault rate.
**Con**: Impossible to implement in reality because it requires clairvoyance (It's used as a benchmark to test other algorithms).

## Thrashing

Thrashing is the worst-case scenario in virtual memory management. It happens when the system spends more time shuffling pages between RAM and the disk than actually executing application instructions.

### The Vicious Cycle

1. The OS loads too many processes into memory (a high degree of multiprogramming).
2. The available frames per process shrink. Processes can no longer hold their active pages.
3. Page faults skyrocket. The CPU sits idle while waiting for the disk I/O to finish.
4. The OS notices the CPU is idle, and incorrectly assumes it needs to add more processes to keep the CPU busy.
5. Adding more processes makes the memory shortage even worse, bringing the system to a crawl.

### Thrashing Avoidance

The OS observes that processes operate in localities (groups of pages needed together at a specific time). It tracks the Working Set Window (Δ)—the set of pages used in the most recent page references. If the sum of all working sets exceeds total physical memory, the OS will suspend/swap out one or more entire processes to free up frames.

## CPU Cache Hierarchy

Computer's RAM is incredibly slow compared to your CPU. While a CPU can process instructions in fractions of a nanosecond, waiting for data to travel from RAM takes around 50 to 100 nanoseconds. To bridge this massive speed gap, chip makers place small, ultra-fast memory pools directly on the CPU die, called Caches (L1, L2, and L3).

**L1 Cache**: Built into each CPU core. It runs at the speed of the processor but is tiny (usually `32KB` to `64KB`).
**L2 Cache**: Slightly larger (`512KB` to `1MB per core`) but a fraction slower than L1.
**L3 Cache**: Shared across all CPU cores. It is much larger (`16MB` to `96MB`) but slower than L2.

> The CPU always checks L1 first, then L2, then L3. If the data is found, it is a **Cache Hit**. If it is not found anywhere in the cache, it is a **Cache Miss**, and the CPU must stall while fetching the data from the slow system RAM.

## Cache Lines

The CPU never fetches just a single byte of data from RAM. Instead, it fetches data in fixed-size chunks called Cache Lines (typically `64 bytes` wide). If you ask for a single integer, the CPU pulls that integer plus the surrounding 60 bytes of data into the cache.

## Principle of Locality

Cache lines relies entirely on the Principle of Locality, which states that programs tend to reuse the same data or nearby data frequently. It breaks down into two distinct types

### Temporal Locality (Locality in Time)

If a memory location is accessed once, it is highly likely to be accessed again in the near future.
**Code Example**: A standard loop variable like i in `for (int i = 0; i < 1000; i++)`.
**Cache Behavior**: The variable i is brought into the L1 cache during the first iteration. For the next 999 iterations, the CPU reads and updates i instantly inside the ultra-fast cache without ever hitting RAM.

### Spatial Locality (Locality in Space)

If a memory location is accessed, nearby memory locations are highly likely to be accessed soon after.
**Code Example**: Accessing index `[0]` of a collection, followed immediately by index `[1]`, `[2]`, and `[3]`.
**Cache Behavior**: When index `[0]` is loaded, the hardware pre-fetches the next chunk of memory into the cache line. By the time the loop requests index `[1]`, that data is already sitting in the L1 cache, waiting to be processed.

## Arrays vs. Linked Lists

The mechanics of spatial locality explain exactly why navigating an Array is fundamentally faster than navigating a Linked List, even if both structures contain the exact same data.

### Arrays

- Arrays are allocated as a single, contiguous block of memory.
- When you read the first element of an array, the CPU fetches a 64-byte cache line from RAM. Because the elements sit directly next to each other, that single cache line automatically pulls the next several elements into the L1 cache. As you iterate through the array, you trigger almost zero cache misses. The CPU runs at maximum efficiency.

### Linked Lists

- Consist of nodes scattered randomly across your system memory, connected only by pointer addresses.
- When you read Node 1, the CPU loads a 64-byte cache line. However, because Node 2 was allocated somewhere else entirely, Node 2 is not inside that cache line.
- To get to Node 2, the CPU must look at the Next pointer, realize the data is missing from the cache, trigger a Cache Miss, and wait for RAM to deliver Node 2. When you reach Node 2, you must wait again for RAM to deliver Node 3. Your CPU spends most of its time sitting completely idle, waiting on memory latency.
