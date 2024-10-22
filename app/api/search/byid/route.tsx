import { NextRequest, NextResponse } from "next/server";

import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { propertyID } = body;
    console.log(propertyID);
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'property_records'
        });

        const [rows] = await connection.execute(
            `SELECT 
    o.name AS owner_name, 
    o.mutation,
    o.khata_no,
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
LEFT JOIN Tenancy t ON o.ownerID = t.ownerID WHERE p.propertyID = '${propertyID}'`);


const formattedData = {
    villageName: (rows as any[])[0]?.village_name ?? '',
    surveyNo: (rows as any[])[0]?.survey_no ?? '',
    subDivisionNo: (rows as any[])[0]?.subdivision ?? '',
    taluka: (rows as any[])[0]?.taluka ?? '',
    total_uncultivable_area: (rows as any[])[0]?.total_uncultivable_area ?? 0,
    total_cultivable_area: (rows as any[])[0]?.total_cultivable_area ?? 0,
    totalArea: (rows as any[])[0]?.grand_total ? parseFloat((rows as any[])[0].grand_total) : null,
    cultivableArea: {
        ker: parseFloat((rows as any[])[0]?.ker) || 0,
        rice: parseFloat((rows as any[])[0]?.rice) || 0,
        dryCrop: parseFloat((rows as any[])[0]?.dry_crop) || 0,
        khzan: parseFloat((rows as any[])[0]?.khazan) || 0,
        morad: parseFloat((rows as any[])[0]?.morad) || 0,
        garden: parseFloat((rows as any[])[0]?.garden) || 0
    },
    uncultivableArea: {
        classA: parseFloat((rows as any[])[0]?.class_A) || 0,
        classB: parseFloat((rows as any[])[0]?.class_B) || 0,
        potKarab: parseFloat((rows as any[])[0]?.pot_kharab) || 0
    },
    owners: [{
        name: (rows as any[])[0]?.owner_name ?? '',
        mutation: (rows as any[])[0]?.mutation ?? '',
        khataNo: (rows as any[])[0]?.khata_no ?? '',
        tenants: (rows as any[]).map(row => row.tenancy_name).filter(Boolean)
    }],
    croppedArea: {
        irrigatedArea: parseFloat((rows as any[])[0]?.irrigated_area) || 0,
        unirrigatedArea: parseFloat((rows as any[])[0]?.unirrigated_area) || 0,
        cropName: (rows as any[])[0]?.crop_name ?? '',
        year: (rows as any[])[0]?.year ?? null,
        season: (rows as any[])[0]?.season ?? '',
        cultivatorName: (rows as any[])[0]?.cultivator_name ?? '',
        landNotAvailableForCultivation: (rows as any[])[0]?.land_not_available_for_cultivation === 1,
        sourceOfIrrigation: (rows as any[])[0]?.source_of_irrigation ?? '',
        remarks: (rows as any[])[0]?.remarks ?? ''
    }
};
await connection.end();
return NextResponse.json(formattedData, { status: 200 });

    } catch (error) {
        console.error('Error fetching land records:', error);
        return NextResponse.json({ error: 'Error fetching land records' }, { status: 500 });
    }
}