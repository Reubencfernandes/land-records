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
            `SELECT * FROM property_details WHERE name = '${name}';
`);
        const formattedData = {
    villageName: (rows as any[])[0]?.village_name ?? 'N/A',
    surveyNo: (rows as any[])[0]?.survey_no ?? 'N/A',
    subDivisionNo: (rows as any[])[0]?.subdivision ?? 'N/A',
    taluka: (rows as any[])[0]?.taluka ?? 'N/A',
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
        name: (rows as any[])[0]?.owner_name ?? 'N/A',
        mutation: (rows as any[])[0]?.mutation ?? 'N/A',
        khataNo: (rows as any[])[0]?.khata_no ?? 'N/A',
        tenants: (rows as any[]).map(row => row.tenancy_name).filter(Boolean)
    }],
    croppedArea: {
        irrigatedArea: parseFloat((rows as any[])[0]?.irrigated_area) || 0,
        unirrigatedArea: parseFloat((rows as any[])[0]?.unirrigated_area) || 0,
        cropName: (rows as any[])[0]?.crop_name ?? 'N/A',
        year: (rows as any[])[0]?.year ?? null,
        season: (rows as any[])[0]?.season ?? 'N/A',
        cultivatorName: (rows as any[])[0]?.cultivator_name ?? 'N/A',
        landNotAvailableForCultivation: (rows as any[])[0]?.land_not_available_for_cultivation === 1,
        sourceOfIrrigation: (rows as any[])[0]?.source_of_irrigation ?? 'N/A',
        remarks: (rows as any[])[0]?.remarks ?? 'N/A'
    }
};
await connection.end();

        // Return the formatted data as JSON along with a redirect URL
        return NextResponse.json(formattedData, { status: 200 });

    } catch (error) {
        console.error('Error fetching land records:', error);
        return NextResponse.json({ error: 'Error fetching land records' }, { status: 500 });
    }
}