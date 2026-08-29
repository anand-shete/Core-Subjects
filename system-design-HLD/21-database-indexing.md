Actual data is not stored in tables in DBMS, it is just a logical representation.

> Refer to [Indexing](../database-management-system/3-indexing.md)

## Data page

Each data page is used to store multiple table rows.
DBMS creates and manages data pages as its fundamental unit of storage.
Size of a single data page depends on the engine (e.g., PostgreSQL is 8 KB, MySQL InnoDB is 16 KB).

## Data block

Data block (or sector) is the minimum amount of data that can be read/written by an underlying hardware/OS I/O operation.
It is managed by underlying storage (e.g., Disk, SSD, OS file system).
Data block size is typically 4 KB.

> DBMS maintains a mapping of Data pages to Data blocks (ensuring page sizes are multiples of block sizes to avoid torn writes).

## Indexing

Indexing is a data structure technique used to quickly locate and access data without searching every row or document (avoids full table scans).

B+ Tree data structure provides $O(log\ n)$ time complexity for search, insert, and deletion.

### Working of B+ Tree (Standard for Database Indexes)

It maintains sorted data for fast lookups.

- All leaf nodes are at the exact same level (perfectly balanced).
- An `M`-order B+ Tree means each node can have at most `M` children and `M-1` keys.
- **Key Difference from B-Tree**: Intermediate (internal) nodes ONLY hold keys for routing. All data pointers or actual row data reside strictly in the leaf nodes.
- **Leaf Node Linking**: Leaf nodes are linked together via a doubly-linked list. This allows for incredibly fast sequential range scans.
- **Node Splitting**: If a node/page runs out of space during an insertion, it splits into two nodes, and the middle key is pushed up to the parent node.

| Feature        | B-Tree                                                    | B+ Tree                                                         |
| -------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| Data Storage   | Data and keys stored in both internal and leaf nodes.     | Data is stored only in the leaf nodes.                          |
| Internal Nodes | Stores both search keys and data pointers.                | Stores only search keys and child pointers.                     |
| Leaf Nodes     | Not linked together.                                      | Linked together as a chain for sequential access.               |
| Range Queries  | Less efficient; requires traversing multiple tree levels. | Highly efficient due to the horizontal links at the leaf level. |

## Types of Indexing

### 1. Clustered Indexing

In clustered indexing, the physical order of rows inside the data pages matches the logical order of the index

- There can only be 1 clustered index per table.
- If you don't specify a Clustered index, the DBMS automatically uses the PRIMARY KEY (which is UNIQUE and NOT NULL).
- If no PRIMARY KEY is used, engines like InnoDB create a hidden internal column (row ID counter) to act as the clustered index.

### 2. Non-clustered Indexing

Non clustered indexing is index structure which is completely separate from the data rows

- The leaf nodes of a non-clustered index contain the indexed key value and a **pointer** to the actual row data (the pointer is either a physical Row ID or the Clustered Index Key).
- You can have multiple non-clustered indexes on a single table.
