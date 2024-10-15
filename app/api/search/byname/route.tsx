import { NextRequest, NextResponse } from "next/server";

import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name } = body;

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'property_records'
        });

        const [rows] = await connection.execute(
            `SELECT * FROM property,owners WHERE owners.name = ${name} AND property.property_id = owners.property_id`);

        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error('Error fetching land records:', error);
        return NextResponse.json({ error: 'Error fetching land records' }, { status: 500 });
    }
}