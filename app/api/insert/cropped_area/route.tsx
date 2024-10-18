import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    croppedareaid,
    propertyid,
    irrigatedArea,
    year,
    season,
    cultivatorName,
    cropName,
    landNotAvailable,
    sourceOfIrrigation,
    cropRemarks,
    unirrigatedArea
  } = body;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Property_Records',
    });

    const [result] = await connection.execute(
      `INSERT INTO CroppedArea (cropID, propertyID, irrigated_area, year, season, cultivator_name, crop_name, land_not_available_for_cultivation, source_of_irrigation, remarks, unirrigated_area) 
      VALUES ('${croppedareaid}', '${propertyid}', ${irrigatedArea}, ${year}, '${season}', '${cultivatorName}', '${cropName}', ${landNotAvailable}, '${sourceOfIrrigation}', '${cropRemarks}', ${unirrigatedArea})`

    );

    await connection.end();

    return NextResponse.json({ message: 'Cropped area record inserted successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error inserting cropped area record:', error);
    return NextResponse.json({ message: 'Error inserting cropped area record', error }, { status: 500 });
  }
}
