import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { taluka, villageName, surveyNo, subDiv } = body;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Property_Records',
    });

    // Get the propertyID
    const [propertyRows] = await connection.execute(
      `SELECT propertyID FROM Property WHERE taluka = '${taluka}' AND village_name = '${villageName}' AND survey_no = '${surveyNo}' AND subdivision = '${subDiv}'`
    );

    if ((propertyRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const propertyID = (propertyRows as any[])[0].propertyID;

    // Delete related records
    await connection.execute(`DELETE FROM CroppedArea WHERE propertyID = '${propertyID}'`);
    await connection.execute(`DELETE FROM Tenancy WHERE ownerID IN (SELECT ownerID FROM Owners WHERE propertyID = '${propertyID}')`);
    await connection.execute(`DELETE FROM Owners WHERE propertyID = '${propertyID}'`);
    await connection.execute(`DELETE FROM Property WHERE propertyID = '${propertyID}'`);

    await connection.end();

    return NextResponse.json({ message: 'Property and related records deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting property and related records:', error);
    return NextResponse.json({ error: 'Error deleting property and related records' }, { status: 500 });
  }
}
