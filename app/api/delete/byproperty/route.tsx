import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { propertyID } = body;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Property_Records',
    });

    // Check if the property exists
    const [propertyRows] = await connection.execute(
      `SELECT propertyID FROM Property WHERE propertyID = '${propertyID}'`
    );

    if ((propertyRows as any[]).length === 0) {
      await connection.end();
      return new NextResponse(
        `<html>
          <head>
          <title>Land Records</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="flex items-center justify-center h-screen bg-gray-100">
            <div class="text-center">
              <h1 class="text-2xl font-bold mb-4">Property Not Found</h1>
              <p class="mb-4">The specified property could not be found.</p>
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

    // Delete related records
    await connection.execute(`DELETE FROM CroppedArea WHERE propertyID = '${propertyID}'`);
    await connection.execute(`DELETE FROM Tenancy WHERE ownerID IN (SELECT ownerID FROM Owners WHERE propertyID = '${propertyID}')`);
    await connection.execute(`DELETE FROM Owners WHERE propertyID = '${propertyID}'`);
    await connection.execute(`DELETE FROM Property WHERE propertyID = '${propertyID}'`);

    await connection.end();

    return new NextResponse(
      `<html>
        <head>
        <title>Land Records</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="flex items-center justify-center h-screen bg-gray-100">
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-4">Property Deleted</h1>
            <p class="mb-4">Property and related records deleted successfully</p>
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
    console.error('Error deleting property and related records:', error);
    return new NextResponse(
      `<html>
        <head>
        <title>Land Records</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="flex items-center justify-center h-screen bg-gray-100">
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-4">Error</h1>
            <p class="mb-4">Error deleting property and related records</p>
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
