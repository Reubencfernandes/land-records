import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    owner_name,
    taluka,
    village_name,
    survey_no,
    sub_div,
    area,
    assessment,
    tenure,
    class_of_land,
    tenure_number,
    pot_kharaba,
    crop,
  } = body;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Property_Records',
    });

    const [result] = await connection.execute(
      'INSERT INTO land_records (owner_name, taluka, village_name, survey_no, sub_div, area, assessment, tenure, class_of_land, tenure_number, pot_kharaba, crop) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [owner_name, taluka, village_name, survey_no, sub_div, area, assessment, tenure, class_of_land, tenure_number, pot_kharaba, crop]
    );

    await connection.end();

    return NextResponse.json({ message: 'Record inserted successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error inserting record:', error);
    return NextResponse.json({ message: 'Error inserting record', error }, { status: 500 });
  }
}
