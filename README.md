### DMQP Project - Next.js Application

This project is a Next.js application developed for the DMQP project. It uses the MySQL package to perform various database operations.

#### Technologies Used
- **Next.js**: A React framework for server-rendered applications.
- **MySQL**: A relational database management system.

### MySQL Functions Used

#### Create
Creates a new table or database in MySQL.
Example:
```sql
CREATE DATABASE Property_Records;

CREATE TABLE Property (
  propertyID VARCHAR(255) PRIMARY KEY,
  village_name VARCHAR(100),
  survey_no INT,
  taluka VARCHAR(100),
  subdivision INT,
  ker DECIMAL(10,2),
  rice DECIMAL(10,2),
  dry_crop DECIMAL(10,2),
  khazan DECIMAL(10,2),
  morad DECIMAL(10,2),
  garden DECIMAL(10,2),
  total_uncultivable_area DECIMAL(10,2) GENERATED ALWAYS AS (
    ker + rice + dry_crop + khazan + morad + garden
  ) VIRTUAL,
  pot_kharab DECIMAL(10,2),
  class_A DECIMAL(10,2),
  class_B DECIMAL(10,2),
  total_cultivable_area DECIMAL(10,2) GENERATED ALWAYS AS (
    pot_kharab + class_A + class_B
  ) VIRTUAL,
  grand_total DECIMAL(10,2) GENERATED ALWAYS AS (
    total_uncultivable_area + total_cultivable_area
  ) VIRTUAL
);

CREATE TABLE Owners (
  ownerID VARCHAR(255) PRIMARY KEY,
  propertyID VARCHAR(255),
  mutation INT,
  name VARCHAR(255),
  khata_no INT,
  remarks TEXT,
  FOREIGN KEY (propertyID) REFERENCES Property(propertyID)
);

CREATE TABLE Tenancy (
  tenancyID VARCHAR(255) PRIMARY KEY,
  ownerID VARCHAR(255),
  name VARCHAR(255),
  khata_no INT,
  remarks TEXT,
  mutation INT,
  FOREIGN KEY (ownerID) REFERENCES Owners(ownerID)
);

CREATE TABLE CroppedArea (
  cropID VARCHAR(255) PRIMARY KEY,
  propertyID VARCHAR(255),
  irrigated_area DECIMAL(10,2),
  year INT,
  season VARCHAR(50),
  cultivator_name VARCHAR(255),
  crop_name VARCHAR(255),
  land_not_available_for_cultivation BOOLEAN,
  source_of_irrigation VARCHAR(100),
  remarks TEXT,
  unirrigated_area DECIMAL(10,2),
  FOREIGN KEY (propertyID) REFERENCES Property(propertyID)
);

CREATE TABLE IF NOT EXISTS log_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message VARCHAR(255),
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Insert
Inserts new data into a table.
Example:
```sql
INSERT INTO Property (
    propertyID, village_name, survey_no, taluka, subdivision,
    ker, rice, dry_crop, khazan, morad, garden,
    pot_kharab, class_A, class_B
  )
  VALUES
('PROP001', 'Mulgao', 12, 'Bicholim', 1, 15.0, 18.0, 12.0, 11.0, 14.0, 13.0, 12.0, 15.0, 14.0),
('PROP002', 'Sal', 7, 'Bicholim', 2, 12.0, 17.0, 14.0, 13.0, 16.0, 15.0, 11.0, 16.0, 13.0),
('PROP003', 'Maulinguem', 25, 'Bicholim', 1, 10.0, 11.0, 13.0, 12.0, 14.0, 15.0, 16.0, 17.0, 18.0),
('PROP004', 'Sanquelim', 30, 'Bicholim', 2, 17.0, 16.0, 15.0, 14.0, 13.0, 12.0, 11.0, 18.0, 16.0),
('PROP005', 'Mapusa', 45, 'Bardez', 1, 14.0, 13.0, 12.0, 11.0, 10.0, 15.0, 16.0, 14.0, 15.0),
('PROP006', 'Panaji', 60, 'Tiswadi', 2, 18.0, 17.0, 16.0, 15.0, 14.0, 13.0, 12.0, 15.0, 17.0);

INSERT INTO Owners 
(ownerID, propertyID, mutation, name, khata_no, remarks)
 VALUES
('OWN001', 'PROP001', 1001, 'Sebastiao D''Souza', 2001, 'Primary owner'),
('OWN002', 'PROP002', 1002, 'Eklavya Naik', 2002, 'Joint owner'),
('OWN003', 'PROP003', 1003, 'Caetano Fernandes', 2003, 'Inherited property'),
('OWN004', 'PROP004', 1004, 'Anjali Kamat', 2004, 'New owner'),
('OWN005', 'PROP005', 1005, 'Rajesh Gupta', 2005, 'Primary owner'),
('OWN006', 'PROP006', 1006, 'Maria Pereira', 2006, 'Joint owner');

INSERT INTO Tenancy 
(tenancyID, ownerID, name, khata_no, remarks, mutation)
  VALUES
('TEN001', 'OWN001', 'Gaurang Vernekar', 3001, 'Long-term tenant', 2001),
('TEN002', 'OWN002', 'Harinarayan Kamat', 3002, 'Seasonal tenant', 2002),
('TEN003', 'OWN003', 'Menino Carvalho', 3003, 'New tenant', 2003),
('TEN004', 'OWN001', 'Sanjay Singh', 3004, 'Short-term tenant', 2004),
('TEN005', 'OWN004', 'Neha Sharma', 3005, 'Long-term tenant', 2005),
('TEN006', 'OWN005', 'Alok Verma', 3006, 'Seasonal tenant', 2006),
('TEN007', 'OWN006', 'Priya Nair', 3007, 'Temporary tenant', 2007);

INSERT INTO CroppedArea 
(cropID, propertyID, irrigated_area, year, season, cultivator_name,   crop_name,land_not_available_for_cultivation, source_of_irrigation,
remarks, unirrigated_area)
  VALUES
('CROP001', 'PROP001', 15.0, 2022, 'Kharif', 'Chiranjeevi Desai', 'Rice', FALSE, 'Well', 'Good yield', 12.0),
('CROP002', 'PROP002', 16.0, 2022, 'Rabi', 'Divyanshu Patil', 'Wheat', FALSE, 'Canal', 'Average yield', 13.0),
('CROP003', 'PROP003', 14.0, 2022, 'Zaid', 'Jitendra Sharma', 'Vegetables', TRUE, 'Rain-fed', 'Drought conditions', 15.0),
('CROP004', 'PROP004', 17.0, 2022, 'Kharif', 'Anita Desai', 'Maize', FALSE, 'Well', 'Excellent yield', 14.0),
('CROP005', 'PROP005', 12.0, 2022, 'Rabi', 'Sunil Kulkarni', 'Barley', FALSE, 'Canal', 'Good yield', 10.0),
('CROP006', 'PROP006', 18.0, 2022, 'Zaid', 'Rahul Singh', 'Sugarcane', TRUE, 'Rain-fed', 'Poor yield', 16.0);
```

#### Delete
Deletes data from a table based on a condition.
Example:
```sql
DELETE FROM CroppedArea WHERE propertyID = '${propertyID}';

DELETE FROM Tenancy WHERE ownerID IN (SELECT ownerID FROM Owners WHERE propertyID = '${propertyID}');

DELETE FROM Owners WHERE propertyID = '${propertyID}';

DELETE FROM Property WHERE propertyID = '${propertyID}';
```

#### Select *
Selects all data from a table.
Example:
```sql
SELECT * FROM property_details WHERE propertyID = '${propertyID}';
```

#### Select by ASC
Selects data from a table and orders it in ascending order.
Example:
```sql
SELECT o.name, p.propertyID, p.grand_total FROM Property p , Owners o WHERE p.propertyID = o.propertyID AND p.grand_total BETWEEN ${min} AND ${max} ORDER BY o.name ${sortBy};
```

#### Select MIN
Selects the minimum value in a column.
Example:
```sql
SELECT MIN(salary) FROM employees;
```

#### Select MAX
Selects the maximum value in a column.
Example:
```sql
SELECT MAX(salary) FROM employees;
```
