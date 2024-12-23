import { NextRequest, NextResponse } from "next/server";

import mysql from 'mysql2/promise';

export async function GET(req: NextRequest) {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'property_records'
        });

        const [rows] = await connection.execute(
            `SELECT o.name, p.propertyID, p.grand_total FROM Property p , Owners o WHERE p.propertyID = o.propertyID`);
            await connection.end();
return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error('Error fetching land records:', error);
        return NextResponse.json({ error: 'Error fetching land records' }, { status: 500 });
    }
}