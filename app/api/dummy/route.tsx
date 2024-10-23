import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });

    // Check if database exists
    const [rows] = await connection.execute("SHOW DATABASES LIKE 'Property_Records'");
    if (Array.isArray(rows) && rows.length === 0) {
      await connection.end();
      return new NextResponse(
        `<html>
          <head>
            <title>Land Records</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="flex items-center justify-center h-screen bg-gray-100">
            <div class="text-center">
              <h1 class="text-2xl font-bold mb-4">Database Error</h1>
              <p class="mb-4">Database 'Property_Records' does not exist</p>
              <a href="/" class="text-blue-500 hover:underline">Go to home</a>
            </div>
          </body>
        </html>`,
        {
          status: 404,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    // Select the database before inserting data
    await connection.query('USE Property_Records');

    // Insert Property records
   // Insert Property records
await connection.execute(`
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
  ('PROP006', 'Panaji', 60, 'Tiswadi', 2, 18.0, 17.0, 16.0, 15.0, 14.0, 13.0, 12.0, 15.0, 17.0)
`);

// Insert Owners records
await connection.execute(`
  INSERT INTO Owners (
    ownerID, propertyID, mutation, name, khata_no, remarks
  )
  VALUES
  ('OWN001', 'PROP001', 1001, 'Sebastiao D''Souza', 2001, 'Primary owner'),
  ('OWN002', 'PROP002', 1002, 'Eklavya Naik', 2002, 'Joint owner'),
  ('OWN003', 'PROP003', 1003, 'Caetano Fernandes', 2003, 'Inherited property'),
  ('OWN004', 'PROP004', 1004, 'Anjali Kamat', 2004, 'New owner'),
  ('OWN005', 'PROP005', 1005, 'Rajesh Gupta', 2005, 'Primary owner'),
  ('OWN006', 'PROP006', 1006, 'Maria Pereira', 2006, 'Joint owner')
`);

// Insert Tenancy records
await connection.execute(`
  INSERT INTO Tenancy (
    tenancyID, ownerID, name, khata_no, remarks, mutation
  )
  VALUES
  ('TEN001', 'OWN001', 'Gaurang Vernekar', 3001, 'Long-term tenant', 2001),
  ('TEN002', 'OWN002', 'Harinarayan Kamat', 3002, 'Seasonal tenant', 2002),
  ('TEN003', 'OWN003', 'Menino Carvalho', 3003, 'New tenant', 2003),
  ('TEN004', 'OWN001', 'Sanjay Singh', 3004, 'Short-term tenant', 2004),
  ('TEN005', 'OWN004', 'Neha Sharma', 3005, 'Long-term tenant', 2005),
  ('TEN006', 'OWN005', 'Alok Verma', 3006, 'Seasonal tenant', 2006),
  ('TEN007', 'OWN006', 'Priya Nair', 3007, 'Temporary tenant', 2007)
`);

// Insert CroppedArea records
await connection.execute(`
  INSERT INTO CroppedArea (
    cropID, propertyID, irrigated_area, year, season, cultivator_name,
    crop_name, land_not_available_for_cultivation, source_of_irrigation,
    remarks, unirrigated_area
  )
  VALUES
  ('CROP001', 'PROP001', 15.0, 2022, 'Kharif', 'Chiranjeevi Desai', 'Rice', FALSE, 'Well', 'Good yield', 12.0),
  ('CROP002', 'PROP002', 16.0, 2022, 'Rabi', 'Divyanshu Patil', 'Wheat', FALSE, 'Canal', 'Average yield', 13.0),
  ('CROP003', 'PROP003', 14.0, 2022, 'Zaid', 'Jitendra Sharma', 'Vegetables', TRUE, 'Rain-fed', 'Drought conditions', 15.0),
  ('CROP004', 'PROP004', 17.0, 2022, 'Kharif', 'Anita Desai', 'Maize', FALSE, 'Well', 'Excellent yield', 14.0),
  ('CROP005', 'PROP005', 12.0, 2022, 'Rabi', 'Sunil Kulkarni', 'Barley', FALSE, 'Canal', 'Good yield', 10.0),
  ('CROP006', 'PROP006', 18.0, 2022, 'Zaid', 'Rahul Singh', 'Sugarcane', TRUE, 'Rain-fed', 'Poor yield', 16.0)
`);


    await connection.end();

    return new NextResponse(
      `<html>
        <head>
        <title>Land Records</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="flex items-center justify-center h-screen bg-gray-100">
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-4">Database Status</h1>
            <p class="mb-4">Dummy data inserted successfully into 'Property_Records' database</p>
            <p class="mb-4">Tables populated: Property, Owners, Tenancy, CroppedArea</p>
            <a href="/" class="text-blue-500 hover:underline">Go to home</a>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('Error inserting dummy data:', error);
    return new NextResponse(
      `<html>
        <head>
          <title>Land Records</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="flex items-center justify-center h-screen bg-gray-100">
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-4">Database Error</h1>
            <p class="mb-4">Error inserting dummy data: ${error instanceof Error ? error.message : 'Unknown error'}</p>
            <a href="/" class="text-blue-500 hover:underline">Go to home</a>
          </div>
        </body>
      </html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}
