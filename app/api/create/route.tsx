import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  try {
    // Check if database exists
    const [rows] = await connection.execute(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'Property_Records'"
    );
    if (Array.isArray(rows) && rows.length === 0) {
      // Create database
      await connection.execute("CREATE DATABASE Property_Records");
      console.log("Database 'PropertyDB' created successfully.");

      // Switch to the new database
      await connection.changeUser({ database: 'Property_Records' });

      // Create Property table
      await connection.execute(`
        CREATE TABLE Property (
          propertyID VARCHAR(255) PRIMARY KEY,
          village_name VARCHAR(100),
          survey_no INT,
          taluka VARCHAR(100),
          subdivision INT,
          location VARCHAR(255) GENERATED ALWAYS AS (
            CONCAT(village_name, ', ', taluka, ', ', subdivision, ', Survey No: ', survey_no)
          ) VIRTUAL,
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
        )
      `);
      console.log("Table 'Property' created successfully.");

      // Create Owners table
      await connection.execute(`
        CREATE TABLE Owners (
          ownerID VARCHAR(255) PRIMARY KEY,
          propertyID VARCHAR(255),
          mutation INT,
          name VARCHAR(255),
          khata_no INT,
          remarks TEXT,
          FOREIGN KEY (propertyID) REFERENCES Property(propertyID)
        )
      `);
      console.log("Table 'Owners' created successfully.");

      // Create Tenancy table
      await connection.execute(`
        CREATE TABLE Tenancy (
          tenancyID VARCHAR(255) PRIMARY KEY,
          ownerID VARCHAR(255),
          name VARCHAR(255),
          khata_no INT,
          remarks TEXT,
          mutation INT,
          FOREIGN KEY (ownerID) REFERENCES Owners(ownerID)
        )
      `);
      console.log("Table 'Tenancy' created successfully.");

      // Create CroppedArea table
      await connection.execute(`
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
        )
      `);
      console.log("Table 'CroppedArea' created successfully.");
      

      await connection.execute(`
CREATE TABLE IF NOT EXISTS log_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message VARCHAR(255),
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

await connection.execute(`
DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_property_insert
AFTER INSERT ON Property
FOR EACH ROW
BEGIN
  INSERT INTO log_table (message, time)
  VALUES (CONCAT('New property inserted with ID: ', NEW.propertyID), CURRENT_TIMESTAMP);
END;
//
DELIMITER ;
`);

return new NextResponse(
  `<html>
    <head>
    <title>land records</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="flex items-center justify-center h-screen bg-gray-100">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Database status</h1>
        <p class="mb-4">Database Created Successfully</p>
        <a href="/" class="text-blue-500 hover:underline">Go to home</a>
      </div>
    </body>
  </html>`,
  {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  }
);
    } else {
      return new NextResponse(
        `<html>
          <head>
          <title>land records</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="flex items-center justify-center h-screen bg-gray-100">
            <div class="text-center">
              <h1 class="text-2xl font-bold mb-4">Database Status</h1>
              <p class="mb-4">Database already exists</p>
              <a href="/" class="text-blue-500 hover:underline">Go to home</a>
            </div>
          </body>
        </html>`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(
      `<html>
      <head>
      <title>land records</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="flex items-center justify-center h-screen bg-gray-100">
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-4">Database Creation Error</h1>
          <p class="mb-4">Error creating database or tables: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <a href="/" class="text-blue-500 hover:underline">Go to home</a>
        </div>
      </body>
    </html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } finally {
    await connection.end();
  }
}
