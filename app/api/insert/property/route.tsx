import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    propertyid,
    villageName,
    surveyNo,
    taluka,
    subdivision,
    ker,
    rice,
    dryCrop,
    khazan,
    morad,
    garden,
    potKharab,
    classA,
    classB
  } = body;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Property_Records',
    });

    const [result] = await connection.execute(
      `INSERT INTO Property (propertyID, village_name, survey_no, taluka, subdivision, ker, rice, dry_crop, khazan, morad, garden, pot_kharab, class_A, class_B) 
      VALUES ('${propertyid}', '${villageName}', ${surveyNo}, '${taluka}',${subdivision} , ${ker}, ${rice}, ${dryCrop}, ${khazan}, ${morad}, ${garden}, ${potKharab}, ${classA}, ${classB})`
    );

    await connection.end();

    return NextResponse.json({ message: 'Property record inserted successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error inserting property record:', error);
    return NextResponse.json({ message: 'Error inserting property record', error }, { status: 500 });
  }
}

