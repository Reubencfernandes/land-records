import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    propertyid, // Corrected variable name
    ownerid,
    mutation,
    ownerName,
    khataNo,
    remarks,
    tenants
  } = body; // Ensure this matches the keys in the body

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Property_Records',
    });

    const [result] = await connection.execute(
        `INSERT INTO Owners (ownerID, propertyID, mutation, name, khata_no, remarks) VALUES ('${ownerid}', '${propertyid}', ${mutation}, '${ownerName}', ${khataNo}, '${remarks}')`
      );

    await connection.end();

    return NextResponse.json({ message: 'Owner record inserted successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error inserting owner record:', error);
    return NextResponse.json({ message: 'Error inserting owner record', error }, { status: 500 });
  }
}
