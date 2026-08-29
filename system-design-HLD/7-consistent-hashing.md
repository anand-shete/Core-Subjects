## 1. Traditional Hashing (The Modulo $N$ Disaster)

- $\text{Server} = \text{Hash(Key)} \pmod n$

### Example

If you have 9 servers ($n=9$) and add 1 more ($n+1=10$), the denominator changes for every single calculation.
Total amount of data moved is $\frac{n}{n + 1} = \frac{9}{10} = 90\%$ of your data suddenly hashes to a completely different server.

Your cache is wiped out, and your databases will crash under the sudden load.

## 2. Consistent Hashing (The $1/n$ Savior)

In consistent hashing, $1/n$ is the fractional amount of data or keys that must be migrated when you add or remove a server.
It represents the theoretical mathematical limit for the absolute minimum amount of data movement possible.

- Both keys and servers are mapped to a $360^\circ$ hash ring. A key belongs to the first server it encounters moving clockwise.
- If you add a new server, it only steals a small slice of the ring from its immediate clockwise neighbor.
- Exactly $\frac{1}{n}$ of the total data moves to the new server. The other $n-1$ servers do not move a single byte of data.

> Used when number of servers are not fixed in Horizontal Scaling, Loading balancing

### Example

Imagine you have 4 servers ($n = 4$) holding a total of 1,000,000 keys.

- Scenario A: Adding a 5th Server
  - You scale up to 5 servers.
  - Formula: $\frac{1}{n_{\text{new}}} = \frac{1}{5} = 20\%$
  - Result: The new server takes exactly 200,000 keys ($\frac{1}{5}$ of the data) from its neighbors. The other 800,000 keys stay untouched on their original servers.
- Scenario B: Removing a Server (Crash/Scale Down)
  - One of your 4 servers dies.
  - Formula: $\frac{1}{n_{\text{old}}} = \frac{1}{4} = 25\%$
  - Result: The 250,000 keys that were on the dead server are remapped to its clockwise neighbor. The other 750,000 keys on the remaining 3 servers are completely unaffected.

### Virtual Nodes

In a basic math interview question, the answer is strictly $1/n$. However, in real engineering, you must write down one caveat: Virtual Nodes (vnodes).

Virtual nodes (vnodes) are logical replicas of physical servers mapped across a hash ring to prevent hot spots by ensuring uniform data distribution.

- Without vnodes, when a server takes $\frac{1}{n}$ of the data, it takes it all from one single neighbor, creating a **hot spot**.
- By splitting each physical server into hundreds of virtual nodes scattered randomly across the ring, the $\frac{1}{n}$ data movement is perfectly and evenly distributed across all remaining servers.
