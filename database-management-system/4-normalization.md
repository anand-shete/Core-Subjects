## Normalization

Database normalization is the process of structuring a relational database to minimize data redundancy and prevent data anomalies (Insertion, Update, and Deletion anomalies).

## Normal Forms

Each normal form is a strict subset of the previous one. For e.g. To be in 2NF, a table must already satisfy all requirements of 1NF.

### First Normal Form (1NF)

- **The Rule**: All column values must be atomic (indivisible), and every row must be uniquely identifiable (have a primary key).
- **The Violation**: Storing comma-separated lists, arrays, or nested tables inside a single cell.
- **Example Fix**: If a user has multiple phone numbers, you cannot store them as `"123-456, 789-012"`. You must break them into separate rows or a separate table.

### Second Normal Form (2NF)

- **The Rule**: Must be in 1NF, and have no partial dependencies. Every non-prime attribute (column not part of any candidate key) must depend on the whole of every candidate key, not just a part of it.
- **Target**: This rule only applies when you have a composite primary key (a key made of multiple columns).
- **Example Violation**: A table with a composite key `(StudentID, CourseID)`. If it contains a column `CourseFee`, that fee depends solely on `CourseID` (part of the key), completely ignoring `StudentID`.
- **Example Fix**: Split into two tables `Student_Enrollment(StudentID, CourseID)` and `Courses(CourseID, CourseFee)`.

### Third Normal Form (3NF)

- **The Rule**: Must be in 2NF, and have no transitive dependencies. Non-prime attributes must not depend on other non-prime attributes. They must depend only on the primary key.
- **The Interview Catchphrase**: "Every attribute must depend on the key, the whole key, and nothing but the key (so help me Codd)."
- **Example Violation**: A table `Employees(EmpID, DeptID, DeptName)`. `DeptName` depends on `DeptID`, which in turn depends on `EmpID`. This is a transitive chain (EmpID -> DeptID -> DeptName).
- **Example Fix**: Remove `DeptName` and move it to a dedicated `Departments(DeptID, DeptName)` table.

### Boyce-Codd Normal Form (BCNF)

- **The Rule**: Must be in 3NF. For every non-trivial functional dependency X → Y, X must be a superkey (or candidate key). BCNF handles anomalies that 3NF misses when a table has multiple overlapping composite candidate keys.
- **The Violation**: An internal node/determinant X is driving a dependency, but it is not powerful enough to uniquely identify a row on its own.

## Denormalization

Denormalization is a database optimization technique where redundant data is intentionally added to a table. By avoiding complex table joins, it speeds up read-heavy queries. However, it sacrifices storage efficiency and can complicate data maintenance

### When to Denormalize

1. **High Read-to-Write Ratio (OLAP / Dashboards)**: If a system reads data millions of times a day but only writes once an hour, it makes sense to pre-join tables. For example, duplicating a user's `Username` inside a `Posts` table eliminates a heavy `JOIN Users ON ...` every time someone loads a timeline.
2. **Aggregations & Analytics**: If you frequently run queries like `SELECT SUM(OrderAmount)`, calculating this on millions of rows live will crash your database. Storing a denormalized, pre-calculated `TotalSpent` directly inside the `Customers` table saves massive CPU cycles.
3. **Geographical or Temporal History Log**: Storing the Price of an item directly inside an `InvoiceLines` table. Even if the master `Products` table changes its price tomorrow, the invoice must permanently retain the exact price active at the precise second the transaction occurred.

### The Heavy Cost of Denormalization

- **Application-Level Complexity**: Your backend software code is now fully responsible for data integrity. If a user updates their `Username`, your application code must run a heavy background script to find and update that username across every single denormalized table in the system.
- **Increased Storage Overhead**: Duplicating strings and large columns across millions of rows dramatically balloons disk usage and forces larger indexes.
