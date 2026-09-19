# Indexing

Indexing in a DBMS is a data structure technique used to speed up data retrieval operations. When you create an index, the DBMS builds a separate, smaller data structure (like a tree or hash map) using the indexed column and physical memory pointers.

## N+1 Query problem

The N+1 query problem is a common database performance bottleneck that occurs when an application executes one primary query to fetch a list of records (1) and then executes additional queries for each record (N) to fetch related child data. Instead of executing one or two efficient queries, the system makes N+1 individual database round trips, heavily draining application performance and server resources

> N+1 query problem can occur in client and server side

### B-Trees: The Self-Balancing Tree

A B-Tree of order M can have up to M children. Nodes in a B-Tree can store multiple keys and data pointers.

- **Storage**: Data records (or pointers to the actual disk blocks) are stored in all nodes, including both internal and leaf nodes.
- **Search**: To find a key, the algorithm starts at the root, compares the search key to the keys in the node, and navigates down the appropriate child pointer. The search can terminate as soon as the key is found, regardless of whether it’s in an internal or leaf node.
- **Advantages**: Very efficient when data retrieval needs to be uniform or when the database has an even mix of reads and writes. Exact matches can sometimes take fewer steps if the key is located in an upper-level node.

### B+ Trees: The Database Favorite

A B+ Tree is an advanced, optimized variant of the B-Tree. It is the foundation for major relational databases and file systems.

- **Storage**: All actual data records or data pointers are stored only in the leaf nodes. Internal nodes store only "signposts" (navigation keys) and child pointers.
- **Search**: Searching always begins at the root and ends at the leaf level, even for exact matches.
- **The Linked Advantage**: All leaf nodes are chained together sequentially using linked list pointers (next/prev pointer).
- **Superior Range Queries**: Because leaf nodes are linked, operations like `SELECT * FROM table WHERE age > 20 AND age < 50` can be completed incredibly fast by traversing the linked list at the bottom, without going back up the tree.
- **Better Fan-out**: Because internal nodes do not store large data payloads (only keys and pointers), they can hold more keys per node. This flattens the tree’s height, drastically reducing the number of disk I/O operations required for lookups.

## Clustered vs. Non-Clustered Indexes

## Why Indexing Speeds Up Reads

To find a record without an index, the database engine must execute a Full Table Scan. It physically reads every single page from disk into memory to check if the rows match the query criteria.

1. **Logarithmic Search $O(log\ N)$**: The database traverses a highly dense, balanced tree structure. Instead of reading thousands of pages, it can pinpoint a row in a table of millions using only 3 to 4 page lookups.
2. **High Fan-Out**: Internal pages of a B+ Tree store thousands of keys and pointers but no data payloads. A single page read narrows down the search space drastically.
3. **Sequential Leaf Scanning**: For range queries (e.g. `WHERE age BETWEEN 20 AND 30`), the engine uses the index to find the starting point, then simply walks the horizontal linked list connecting the leaf nodes

> Indexing reduces time complexity from $O(N)$ to $O(log\ N)$

## Why Indexing Slows Down Writes

When you modify data, the engine cannot just append bytes to the end of a file. It must instantly update the data table and keep every associated index perfectly synchronised and balanced.

1. **Multiplication of Write Operations**
   If a table has 1 clustered index and 4 non-clustered indexes, a single `INSERT` statement is not 1 write operation. The database engine must execute 5 separate write operations across 5 distinct B+ Tree structures to keep the metadata accurate.

2. **The Overhead of Disk Sorting**
   A clustered index enforces a physical order on disk. When inserting a row with a random primary key (like a `UUID`), the engine cannot just throw it at the end of the file. It must locate the precise physical page where that key belongs and wedge it into place.

3. **Node Splitting and Page Structural Changes**
   Disk space is allocated in fixed-size blocks called pages (typically `16KB` in engines like MySQL InnoDB).
   - **The Problem**: If a new key needs to be inserted into an index page that is already 100% full, the database cannot simply resize the block.
   - **The Process (Node Split)**: The engine must allocate a brand-new page, move half of the keys from the full page into the new page, update the pointers connecting them, and insert a new pointer into the parent internal node.
   - **Cascade Effect**: If the parent internal node is also full, the split cascades upward, potentially all the way to the root. This causes massive random disk I/O

4. **Page Fragmentation**
   Frequent deletes and unaligned inserts leave empty, fragmented pockets of space inside index pages. The database engine must spend background CPU cycles scanning, merging, and reorganising these pages to prevent performance degradation.
