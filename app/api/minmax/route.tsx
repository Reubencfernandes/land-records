import { NextRequest, NextResponse } from "next/server";

import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
    const { min, max } = await req.json();
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'property_records'
        });

        const [rows] = await connection.execute(
            `SELECT o.name, p.propertyID, p.grand_total FROM Property p , Owners o WHERE p.propertyID = o.propertyID AND p.grand_total BETWEEN ${min} AND ${max}`);
await connection.end();
return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error('Error fetching land records:', error);
        return NextResponse.json({ error: 'Error fetching land records' }, { status: 500 });
    }
}