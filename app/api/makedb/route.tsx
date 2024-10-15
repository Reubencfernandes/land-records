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
          survey_no VARCHAR(50),
          taluka VARCHAR(100),
          subdivision VARCHAR(50),
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
          ownerID INT PRIMARY KEY,
          propertyID VARCHAR(255),
          mutation VARCHAR(100),
          name VARCHAR(255),
          khata_no VARCHAR(50),
          remarks TEXT,
          FOREIGN KEY (propertyID) REFERENCES Property(propertyID)
        )
      `);
      console.log("Table 'Owners' created successfully.");

      // Create Tenancy table
      await connection.execute(`
        CREATE TABLE Tenancy (
          tenancyID INT PRIMARY KEY,
          ownerID INT,
          name VARCHAR(255),
          khata_no VARCHAR(50),
          remarks TEXT,
          mutation VARCHAR(100),
          FOREIGN KEY (ownerID) REFERENCES Owners(ownerID)
        )
      `);
      console.log("Table 'Tenancy' created successfully.");

      // Create CroppedArea table
      await connection.execute(`
        CREATE TABLE CroppedArea (
          cropID INT AUTO_INCREMENT PRIMARY KEY,
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

      return NextResponse.json({ message: 'Database and tables created successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Database already exists' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error creating database or tables', error }, { status: 500 });
  } finally {
    await connection.end();
  }
}
