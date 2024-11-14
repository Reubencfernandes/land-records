
---

### **1 - SELECT**

1. **Select all columns from a table**
   ```sql
   SELECT * FROM [tablename];
   ```
   - This query retrieves all the columns and rows from a specified table.
   - Example: Viewing all data in an employee database.

2. **Select specific columns from a table**
   ```sql
   SELECT [columnname], [columnname] FROM [tablename];
   ```
   - Retrieves only the specified columns.
   - Example: Selecting just the `name` and `salary` columns from an employee table.

---

### **2 - SORTING TABLES**

1. **Order rows in ascending order**
   ```sql
   SELECT * FROM [tablename] ORDER BY [columnname] ASC;
   ```
   - Sorts rows in ascending order based on the specified column.
   - Example: Sorting employees by their `salary` from lowest to highest.

2. **Order rows by specific values**
   ```sql
   SELECT * FROM [tablename] ORDER BY FIELD([columnname], '[valuename1]', '[valuename2]');
   ```
   - Custom sorting based on a specific sequence of values.
   - Example: Sorting products based on their `status` like 'in-stock', 'back-order'.

---

### **3 - FILTERING**

1. **Filter rows with a condition**
   ```sql
   SELECT * FROM [tablename] WHERE [columnname] = '[valuename]';
   ```
   - Filters rows where a column equals a specific value.
   - Example: Employees where `department` is 'Sales'.

2. **Filter rows with multiple conditions**
   ```sql
   SELECT [columnname] FROM [tablename] WHERE [columnname] = '[valuename1]' AND [columnname] = '[valuename2]';
   ```
   - Retrieves rows meeting all conditions.
   - Example: Offices in both 'Japan' and 'Tokyo'.

3. **Use OR for filtering**
   ```sql
   SELECT * FROM [tablename] WHERE [columnname] = '[valuename1]' OR [columnname] = '[valuename2]';
   ```
   - Retrieves rows meeting either condition.
   - Example: Customers from 'USA' or 'Japan'.

4. **Filter rows within a range**
   ```sql
   SELECT [columnname] FROM [tablename] WHERE [columnname] BETWEEN [valuename1] AND [valuename2];
   ```
   - Filters rows where the value lies within a specified range.
   - Example: Employees with `age` between 25 and 40.

5. **Pattern-based filtering**
   ```sql
   SELECT * FROM [tablename] WHERE [columnname] LIKE '[pattern]';
   ```
   - Filters rows matching a pattern.
   - Example: Customers whose names start with 'A%' or end with '%z'.

6. **Filter rows using a list**
   ```sql
   SELECT * FROM [tablename] WHERE [columnname] IN ([valuename1], [valuename2]);
   ```
   - Retrieves rows where the column matches any value in a list.
   - Example: Offices in 'USA' or 'Japan'.

7. **Filter null values**
   ```sql
   SELECT * FROM [tablename] WHERE [columnname] IS NULL;
   ```
   - Retrieves rows with null values.
   - Example: Employees without a `manager`.

8. **Aggregate and count values**
   ```sql
   SELECT COUNT([columnname]), [columnname] FROM [tablename] GROUP BY [columnname];
   ```
   - Groups rows by a column and counts entries in each group.
   - Example: Counting the number of employees in each department.

9. **Limit the number of rows returned**
   ```sql
   SELECT [columnname] FROM [tablename] LIMIT [valuename];
   ```
   - Retrieves a specific number of rows.
   - Example: Getting the top 5 highest-paid employees.

---

### **4 - JOINING TABLES**

1. **Inner Join**
   ```sql
   SELECT [columnname1], [columnname2] FROM [tablename1] INNER JOIN [tablename2] ON [tablename1].[columnname] = [tablename2].[columnname];
   ```
   - Combines rows where the join condition matches in both tables.
   - Example: Match employees to their respective office locations.

2. **Left Join**
   ```sql
   SELECT [columnname1], [columnname2] FROM [tablename1] LEFT JOIN [tablename2] ON [tablename1].[columnname] = [tablename2].[columnname];
   ```
   - Includes all rows from the left table and matches from the right table.
   - Example: All employees with their office details, even if an office isn’t assigned.

3. **Right Join**
   ```sql
   SELECT [columnname1], [columnname2] FROM [tablename1] RIGHT JOIN [tablename2] ON [tablename1].[columnname] = [tablename2].[columnname];
   ```
   - Includes all rows from the right table and matches from the left table.
   - Example: All offices with their employees, even if no employees are assigned.

4. **Cross Join**
   ```sql
   SELECT [columnname1], [columnname2] FROM [tablename1] CROSS JOIN [tablename2];
   ```
   - Produces a Cartesian product of the two tables.
   - Example: Combining all products with all suppliers.

---

### **5 - GROUPING DATA**

1. **Group by and aggregate**
   ```sql
   SELECT [columnname] FROM [tablename] GROUP BY [columnname];
   ```
   - Groups rows by a column and performs aggregation.
   - Example: Grouping sales by region.

2. **Summation**
   ```sql
   SELECT SUM([columnname]) FROM [tablename];
   ```
   - Calculates the total sum of a column.
   - Example: Total revenue.

3. **Group by with conditions**
   ```sql
   SELECT [columnname], COUNT([columnname]) FROM [tablename] GROUP BY [columnname] HAVING [columnname] > [valuename];
   ```
   - Filters groups based on aggregate values.
   - Example: Departments with more than 5 employees.

---

### **6 - SUBQUERIES**

1. **Use a subquery in `IN`**
   ```sql
   SELECT [columnname] FROM [tablename1] WHERE [columnname] IN (SELECT [columnname] FROM [tablename2]);
   ```
   - Uses a subquery result to filter data.
   - Example: Employees working in specific offices.

2. **Find maximum or minimum values**
   ```sql
   SELECT [columnname] FROM [tablename] WHERE [columnname] = (SELECT MAX([columnname]) FROM [tablename]);
   ```
   - Retrieves rows with the maximum value in a column.
   - Example: Product with the highest price.

---

### **7 - QUERYING DATA**

1. **Create table**
   ```sql
   CREATE TABLE IF NOT EXISTS [tablename] ([columnname] INT AUTO_INCREMENT, PRIMARY KEY ([columnname]));
   ```
   - Creates a new table with specified columns.

2. **Insert data**
   ```sql
   INSERT INTO [tablename] ([columnname1], [columnname2]) VALUES ('[valuename1]', '[valuename2]');
   ```
   - Adds data to a table.

3. **Update data**
   ```sql
   UPDATE [tablename] SET [columnname] = '[valuename]' WHERE [columnname] = '[valuename]';
   ```
   - Modifies data in a table.

4. **Delete data**
   ```sql
   DELETE FROM [tablename];
   ```
   - Deletes all data from a table.

---

### **8 - SET OPERATORS**

1. **Union**
   ```sql
   SELECT [columnname] FROM [tablename1] UNION SELECT [columnname] FROM [tablename2];
   ```
   - Combines results from multiple queries, removing duplicates.

2. **Intersect**
   ```sql
   SELECT [columnname] FROM [tablename1] INTERSECT SELECT [columnname] FROM [tablename2];
   ```
   - Retrieves common rows from both queries.

3. **Except**
   ```sql
   SELECT [columnname] FROM [tablename1] EXCEPT SELECT [columnname] FROM [tablename2];
   ```
   - Retrieves rows present in the first query but not in the second.

---

### **9 - DATABASE AND TABLES**

1. **Create database**
   ```sql
   CREATE DATABASE IF NOT EXISTS [databasename];
   ```
   - Creates a new database.

2. **Alter table**
   ```sql
   ALTER TABLE [tablename] ADD [columnname] INT;
   ```
   - Modifies the structure of an existing table.

---

### **10 - TRIGGERS**

1. **Create trigger**
   ```sql
   CREATE TRIGGER [triggername]
   AFTER INSERT ON [tablename]
   FOR EACH ROW
   BEGIN
       INSERT INTO [tablename2] ([columnname]) VALUES ('[valuename]');
   END;
   ```
   - Automatically performs actions after an event.

---

### **11 - VIEWS**

1. **Create a view**
   ```sql
   CREATE VIEW [viewname] AS SELECT [columnname] FROM [tablename1] INNER JOIN [tablename2] USING([columnname]);
   ```
   - Creates a virtual table based on a query.

---
