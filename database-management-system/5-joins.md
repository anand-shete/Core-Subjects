## Joins

An SQL JOIN clause combines rows from two or more tables based on a related column between them. This allows you to extract meaningful, connected information that has been split across multiple tables during database normalization.

### INNER JOIN

**The Strict Match**: Returns rows only when there is a perfect match in both tables. If a row in Table A doesn't have a matching ID in Table B, it is completely excluded from the final result.

It is basically **Intersection $(A \cap B$)**

### LEFT JOIN / LEFT OUTER JOIN

**The Left-Biased Guard**: Returns all rows from the left table, along with matched rows from the right table. If there is no match on the right side, the database fills those right-side columns with `NULL`.

> This is the most heavily used join in production apps (e.g. fetching a list of all users and their orders, even if some users haven't ordered anything yet).

### RIGHT JOIN / RIGHT OUTER JOIN

**The Mirror Image**: Returns all rows from the right table, along with matched rows from the left table. If there is no match on the left side, the left columns return `NULL`.

> Anything a `RIGHT JOIN` can do, a `LEFT JOIN` can do simply by swapping the table order in the query. Most engineering teams stick to `LEFT JOIN` for code readability.

### FULL JOIN / FULL OUTER JOIN

**The All-Inclusive**: Returns all records when there is a match in either left or right table. It combines the behavior of both Left and Right joins. Unmatched attributes on either side are populated with `NULL`.

> MySQL does not natively support `FULL JOIN`. In MySQL, you must mimic it by combining a `LEFT JOIN` and a `RIGHT JOIN` using the `UNION` operator.

### CROSS JOIN

**The Combinatorial Explosion**: Produces a Cartesian Product of both tables. It pairs every single row of Table A with every single row of Table B. No `ON` filtering condition is used. E.g. If Table A has 10 rows and Table B has 100 rows, the result set contains exactly 1,000 rows (10 × 100).

> Running an accidental CROSS JOIN on large production tables can easily exhaust database memory and crash the server.

## How the Database Engine execute Joins

When you write these queries later, the database engine doesn't just do magic; it picks one of three structural algorithms based on your indexes

1. **Nested Loop Join**: For each row in Table A, it loops through Table B. Works fine for small datasets.
2. **Hash Join**: It builds an in-memory hash table of the smaller table for $O(1)$ lookups. Highly efficient for large, unindexed datasets.
3. **Sort-Merge Join**: It sorts both tables by the join key first, then steps through them sequentially. Best when both tables are already sorted by an index.