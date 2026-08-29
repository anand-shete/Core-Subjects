## I/O processing

I/O (Input/Output) in operating systems refers to the communication and data transfer between a computer system and the outside world. It is the mechanism by which the CPU interacts with peripheral devices (keyboards, monitors, printers), storage (hard drives, SSDs), and networks.

### Blocking I/O (The Multi-Threaded Approach)

In traditional environments like Java (Spring Boot) or PHP, I/O operations are synchronous and blocking. Each thread consumes around 1MB of memory for its stack. Worse, when the OS constantly switches between thousands of threads to see which one finished its I/O, it triggers Context Switching.

> The CPU spends more time swapping thread registers in and out of its cores than actually running code.

### Non-blocking I/O (The Asynchronous Approach)

In case of Non-blocking I/O, instead of waiting for slow hardware, a thread asks the OS to start the task and immediately moves on to other work.

To know when the data is ready, the OS provides highly optimized multiplexing mechanisms like `epoll` (Linux), `kqueue` (macOS), or `IOCP` (Windows). These kernel features allow a single thread to monitor thousands of I/O operations simultaneously and get notified exactly when a specific task finishes.

## Node.js: The libuv Architecture

Node.js is completely single-threaded at the JavaScript execution level, yet it can handle millions of concurrent connections. It achieves this by utilizing a C++ library under the hood called libuv, which abstracts the operating system's non-blocking I/O mechanics into the **Event Loop**.

Example: Take this standard node.js code snippet

```js
const fs = require("fs");

fs.readFile("large_video.mp4", (err, data) => {
  console.log("File read complete!");
});

console.log("This prints first!");
```

Here is exactly what happens at the OS level:

1. **The Hand-off**: JavaScript executes `fs.readFile`. Node.js registers this I/O task with the kernel via `libuv` using a non-blocking system call.
2. **The Immediate Return**: Control instantly drops down to the next line. `console.log("This prints first!")` executes immediately. The main JavaScript thread never blocks.
3. **The Kernel Event Loop**: While the JavaScript thread is handling other traffic, the OS kernel is independently streaming the file data from the drive.
4. **The Notification**: Once the file is fully read, `epoll` or the system event notifier flags `libuv`.
5. **The Callback**: The Event Loop picks up the completion notification and pushes the attached JavaScript callback function `console.log("File read complete!")` onto the execution queue to run when the main thread is free.

## Rings

Your CPU enforces a strict hardware barrier between application code and critical system infrastructure using processor execution levels called Rings.

### User mode (Ring 0)

When you run your Node.js server or a browser tab, the CPU executes it in User Mode.
**The Restrictions**: The application has zero direct access to physical hardware, network cards, storage drives, or protected memory areas belonging to other apps. If a user-mode program crashes (e.g. a segmentation fault or an out-of-memory error), the failure is contained. It cannot take down the rest of the computer.

### Kernel Mode (Ring 0)

The core operating system code runs in Kernel Mode.
**The Privileges**: Here, the CPU is completely unrestricted. The kernel can talk directly to device drivers, manipulate raw physical RAM allocations, and control peripheral hardware. Because there are no safety guards, a bug or crash inside kernel mode results in a complete system collapse (e.g. a BSOD on Windows or a Kernel Panic on Linux).

## System Calls: The Secure Gateway

Because user-mode applications cannot touch physical hardware, they must ask the OS kernel to perform those actions on their behalf. This request is handled via a System Call (**Syscall**)

## Process Lifecycles

When a process creates a child process in Linux/Unix, the parent process is legally responsible for tracking the child's lifetime. When the child process finishes its work, the kernel requires the parent to fetch the child's final exit status code using a system call like `wait()` or `waitpid()`.

If this lifecycle management breaks down, it creates two distinct edge-case states:

### Zombie Processes (Dead but not Buried)

A Zombie Process is a child process that has completely finished its execution, but its parent process hasn't collected its final exit status code yet.

**What Happens**: The child process terminates, and its memory space, file handles, and code segments are immediately stripped out of RAM by the OS. However, its entry slot inside the kernel's tracking ledger—the Process Table—must remain active so the parent can see how it died.
**The State**: Until the parent calls `wait()`, the child sits in the process table with a status code of Z (Zombie).
**The Danger**: Zombies do not consume CPU power or RAM. However, because the system's Process Table has a fixed maximum capacity of unique Process IDs (PIDs), a broken parent process that continuously leaks zombies can completely fill the table, preventing the OS from launching any new applications.

### Orphan Processes (Lost Parents)

An Orphan Process is a child process that is still actively running, but its parent process was abruptly killed or terminated before the child finished.
**What Happens**: The child is suddenly left running in the background without a parent tracking its exit state.
**The Rescue**: The Linux kernel explicitly prevents processes from remaining parentless. The moment a parent process dies, the kernel immediately rewrites the orphan's parent PID pointer, adopting the orphan into a system root process—traditionally init or systemd (PID 1).
**The Cleanup**: When the orphan finally finishes executing, PID 1 automatically runs the `wait()` system call on it, securely reaping its resources and ensuring it never becomes a permanent zombie.
