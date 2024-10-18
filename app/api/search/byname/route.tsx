import { NextRequest, NextResponse } from "next/server";

import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log("API",body);
    const { name } = body;

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'property_records'
        });

        const [rows] = await connection.query(
            `SELECT 
    o.name AS owner_name, 
    p.taluka, 
    p.village_name, 
    p.survey_no, 
    p.subdivision, 
    p.ker, 
    p.rice, 
    p.dry_crop, 
    p.khazan, 
    p.morad, 
    p.garden, 
    p.total_uncultivable_area, 
    p.pot_kharab, 
    p.class_A, 
    p.class_B, 
    p.total_cultivable_area, 
    p.grand_total, 
    t.name AS tenancy_name, 
    t.tenancyID,
    ca.irrigated_area,
    ca.unirrigated_area,
    ca.crop_name,
    ca.year,
    ca.season,
    ca.cultivator_name,
    ca.land_not_available_for_cultivation,
    ca.source_of_irrigation,
    ca.remarks 
FROM Property p
JOIN Owners o ON p.propertyID = o.propertyID
JOIN CroppedArea ca ON p.propertyID = ca.propertyID
LEFT JOIN Tenancy t ON o.ownerID = t.ownerID
WHERE o.name = '${name}';
`);
        console.log(rows);
        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error('Error fetching land records:', error);
        return NextResponse.json({ error: 'Error fetching land records' }, { status: 500 });
    }
}