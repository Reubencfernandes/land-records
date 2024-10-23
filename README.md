Based on the provided SQL schema, the tables are **not fully normalized up to Third Normal Form (3NF)**. Below is a detailed analysis of each table, highlighting normalization issues and suggesting improvements.

---

### **1. `admin` Table**

**Schema:**

```sql
CREATE TABLE `admin` (
  `Admin_id` int(11) NOT NULL,
  `Username` varchar(20) NOT NULL,
  `Admin_passw` varchar(20) NOT NULL,
  PRIMARY KEY (`Admin_id`)
);
```

**Analysis:**

- **1NF (First Normal Form):** All columns contain atomic values. ✅
- **2NF (Second Normal Form):** Since the primary key is a single column (`Admin_id`), all non-key attributes must depend on it. ✅
- **3NF (Third Normal Form):** No transitive dependencies exist among non-key attributes. Assuming that `Admin_passw` depends only on `Admin_id` and not on `Username`, the table is in 3NF. ✅

**Conclusion:** The `admin` table is properly normalized up to 3NF.

---

### **2. `booking` Table**

**Schema:**

```sql
CREATE TABLE `booking` (
  `Booking_id` int(11) NOT NULL,
  `Booking_date` date DEFAULT NULL,
  `Start_DateTime` datetime DEFAULT NULL,
  `End_DateTime` datetime DEFAULT NULL,
  `Total_cost` float DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `Hall_id` int(11) DEFAULT NULL,
  `Payment_id` int(11) DEFAULT NULL,
  `Service_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`Booking_id`),
  FOREIGN KEY (`Hall_id`) REFERENCES `conference_hall` (`Hall_id`),
  FOREIGN KEY (`Payment_id`) REFERENCES `payments` (`Payment_id`),
  FOREIGN KEY (`Service_id`) REFERENCES `service` (`Service_id`)
);
```

**Analysis:**

- **1NF:** All columns contain atomic values. ✅
- **2NF:** All non-key attributes depend on the primary key `Booking_id`. ✅
- **3NF:**

  - **Issue with `Total_cost`:** If `Total_cost` is derived from other attributes like `Hall_id`, `Service_id`, `Start_DateTime`, and `End_DateTime`, then storing it violates 3NF because it introduces a transitive dependency.
  - **Issue with `Status`:** If `Status` depends on `Payment_id` (e.g., status changes to 'Paid' when payment is completed), it's a transitive dependency.

**Conclusion:** The `booking` table is **not fully normalized to 3NF** due to transitive dependencies involving `Total_cost` and `Status`.

**Recommendation:**

- Remove `Total_cost` and calculate it dynamically when needed.
- Ensure that `Status` only depends on `Booking_id`, or move it to a related table if it depends on `Payment_id`.

---

### **3. `client` Table**

**Schema:**

```sql
CREATE TABLE `client` (
  `Client_id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Booking_id` int(11) DEFAULT NULL,
  `Organisation` varchar(50) NOT NULL,
  `client_passw` varchar(20) NOT NULL,
  PRIMARY KEY (`Client_id`),
  FOREIGN KEY (`Booking_id`) REFERENCES `booking` (`Booking_id`)
);
```

**Analysis:**

- **1NF:** All columns contain atomic values. ✅
- **2NF:** All non-key attributes depend on `Client_id`. However, `Booking_id` suggests a client can have only one booking.
- **3NF:**

  - **Issue with `Booking_id`:** Placing `Booking_id` in the `client` table implies a one-to-one relationship, which may not reflect real-world scenarios where a client can have multiple bookings.
  - This design can lead to update anomalies and does not properly represent the relationship between clients and bookings.

**Conclusion:** The `client` table is **not properly normalized** and may not even satisfy 2NF due to the improper relationship with `Booking_id`.

**Recommendation:**

- Remove `Booking_id` from the `client` table.
- Add `Client_id` as a foreign key in the `booking` table to establish a one-to-many relationship.
- Alternatively, create a junction table if a many-to-many relationship is needed.

---

### **4. `conference_hall` Table**

**Schema:**

```sql
CREATE TABLE `conference_hall` (
  `Hall_id` int(11) NOT NULL,
  `Hall_Name` varchar(255) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL,
  `Facilities` longtext DEFAULT NULL,
  `Price` int(11) DEFAULT NULL,
  PRIMARY KEY (`Hall_id`)
);
```

**Analysis:**

- **1NF:**

  - **Issue with `Facilities`:** If `Facilities` contains a list of facilities (e.g., as a comma-separated string), it violates 1NF because it is not atomic.
  
- **2NF:** Assuming `Facilities` is atomic, all non-key attributes depend on `Hall_id`. ✅
- **3NF:** If `Price` depends only on `Hall_id`, and there are no transitive dependencies, it is in 3NF. However, the issue with `Facilities` prevents us from reaching this conclusion.

**Conclusion:** The `conference_hall` table is **not in 1NF** due to the `Facilities` column.

**Recommendation:**

- Create a separate `facility` table:

  ```sql
  CREATE TABLE `facility` (
    `Facility_id` int(11) NOT NULL,
    `Facility_name` varchar(255) NOT NULL,
    PRIMARY KEY (`Facility_id`)
  );
  ```

- Create a junction table `hall_facilities` to map facilities to halls:

  ```sql
  CREATE TABLE `hall_facilities` (
    `Hall_id` int(11) NOT NULL,
    `Facility_id` int(11) NOT NULL,
    PRIMARY KEY (`Hall_id`, `Facility_id`),
    FOREIGN KEY (`Hall_id`) REFERENCES `conference_hall` (`Hall_id`),
    FOREIGN KEY (`Facility_id`) REFERENCES `facility` (`Facility_id`)
  );
  ```

---

### **5. `payments` Table**

**Schema:**

```sql
CREATE TABLE `payments` (
  `Payment_id` int(11) NOT NULL,
  `Amount` float DEFAULT NULL,
  `Payment_Date` date DEFAULT NULL,
  `Payment_Status` varchar(50) DEFAULT NULL,
  `Payment_Method` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Payment_id`)
);
```

**Analysis:**

- **1NF:** All columns contain atomic values. ✅
- **2NF:** All non-key attributes depend on `Payment_id`. ✅
- **3NF:** No transitive dependencies exist among non-key attributes. ✅

**Conclusion:** The `payments` table is properly normalized up to 3NF.

---

### **6. `service` Table**

**Schema:**

```sql
CREATE TABLE `service` (
  `Service_id` int(11) NOT NULL,
  `Service_name` varchar(255) DEFAULT NULL,
  `Service_cost` float DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`Service_id`)
);
```

**Analysis:**

- **1NF:** All columns contain atomic values. ✅
- **2NF:** All non-key attributes depend on `Service_id`. ✅
- **3NF:**

  - **Issue with `Service_name` and `Service_cost`:** If `Service_cost` is determined by `Service_name`, then `Service_name` functionally determines `Service_cost`. This introduces a transitive dependency because `Service_name` is not a candidate key.
  - **Issue with `Quantity`:** It's unclear what `Quantity` represents here. If it's the quantity of services ordered per booking, it should not be in the `service` table.

**Conclusion:** The `service` table is **not fully normalized to 3NF** due to transitive dependencies.

**Recommendation:**

- Create a `service_type` table:

  ```sql
  CREATE TABLE `service_type` (
    `ServiceType_id` int(11) NOT NULL,
    `Service_name` varchar(255) NOT NULL,
    `Service_cost` float NOT NULL,
    PRIMARY KEY (`ServiceType_id`)
  );
  ```

- Modify the `service` table to include only service-specific details:

  ```sql
  CREATE TABLE `service` (
    `Service_id` int(11) NOT NULL,
    `ServiceType_id` int(11) NOT NULL,
    `Booking_id` int(11) NOT NULL,
    `Quantity` int(11) DEFAULT NULL,
    PRIMARY KEY (`Service_id`),
    FOREIGN KEY (`ServiceType_id`) REFERENCES `service_type` (`ServiceType_id`),
    FOREIGN KEY (`Booking_id`) REFERENCES `booking` (`Booking_id`)
  );
  ```

---

### **General Recommendations**

- **Adjust Relationships:**

  - **Clients and Bookings:** Modify the schema to reflect that a client can have multiple bookings.
  - **Bookings and Services:** Use a junction table to handle the many-to-many relationship between bookings and services.

- **Eliminate Derived Data:**

  - Remove columns that store calculated or derived data, such as `Total_cost`, unless necessary for performance and handled appropriately.

- **Ensure Atomicity:**

  - Break down columns that contain composite data into separate, atomic columns or related tables.

- **Address Transitive Dependencies:**

  - Reorganize tables to ensure non-key attributes depend only on primary keys.

---

**Final Conclusion:** The current schema has multiple normalization issues that prevent it from being fully normalized up to 3NF. By addressing the identified issues and implementing the recommended changes, you can achieve a properly normalized database schema.
