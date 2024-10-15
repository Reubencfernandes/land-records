import { NextRequest, NextResponse } from "next/server";

import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { taluka, village_name,survey_no,sub_division} = body;

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'property_records'
        });

        const [rows] = await connection.execute(
            `SELECT * FROM property,owners WHERE taluka = ${taluka} AND village_name = ${village_name} AND survey_no = ${survey_no} AND subdivision = ${sub_division} AND property.property_id = owners.property_id`);

        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error('Error fetching land records:', error);
        return NextResponse.json({ error: 'Error fetching land records' }, { status: 500 });
    }
}