import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
      ownerid,
      tenancyid,
      tenantName,
      tenantKhataNo,
      tenantRemarks,
      tenantMutation
  } = body;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Property_Records',
    });

    const [result] = await connection.execute(
      `INSERT INTO Tenancy (tenancyID, ownerID, name, khata_no, remarks, mutation) VALUES ('${tenancyid}', '${ownerid}', '${tenantName}', ${tenantKhataNo}, '${tenantRemarks}', ${tenantMutation})`
    );

    await connection.end();

    return NextResponse.json({ message: 'Tenancy record inserted successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error inserting tenancy record:', error);
    return NextResponse.json({ message: 'Error inserting tenancy record', error }, { status: 500 });
  }
}
