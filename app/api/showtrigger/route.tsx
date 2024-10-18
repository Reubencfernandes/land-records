import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise';

export async function GET() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'property_records'
        });

        const [rows] = await connection.execute(
            `SELECT * FROM log_table`
        );

        await connection.end(); // Close the database connection

        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching log records:', error);
        return NextResponse.json({ error: 'Error fetching log records' }, { status: 500 });
    }
}