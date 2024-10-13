<?php
// admin.php

// Database connection info
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "PropertyDB";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// If form submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Property details
    $propertyID = isset($_POST['propertyID']) ? $_POST['propertyID'] : 0;
    $village_name = $_POST['village_name'];
    $survey_no = $_POST['survey_no'];
    $taluka = $_POST['taluka'];
    $subdivision = $_POST['subdivision'];
    $ker = isset($_POST['ker']) ? $_POST['ker'] : 0;
    $rice = isset($_POST['rice']) ? $_POST['rice'] : 0;
    $dry_crop = isset($_POST['dry_crop']) ? $_POST['dry_crop'] : 0;
    $khazan = isset($_POST['khazan']) ? $_POST['khazan'] : 0;
    $morad = isset($_POST['morad']) ? $_POST['morad'] : 0;
    $garden = isset($_POST['garden']) ? $_POST['garden'] : 0;
    $pot_kharab = isset($_POST['pot_kharab']) ? $_POST['pot_kharab'] : 0;
    $class_A = isset($_POST['class_A']) ? $_POST['class_A'] : 0;
    $class_B = isset($_POST['class_B']) ? $_POST['class_B'] : 0;

    // Insert into Property table
    $sql = "INSERT INTO Property (propertyID, village_name, survey_no, taluka, subdivision, ker, rice, dry_crop, khazan, morad, garden, pot_kharab, class_A, class_B)
            VALUES ('$propertyID', '$village_name', '$survey_no', '$taluka', '$subdivision', '$ker', '$rice', '$dry_crop', '$khazan', '$morad', '$garden', '$pot_kharab', '$class_A', '$class_B')";
    if (mysqli_query($conn, $sql)) {
        echo "Property added successfully.<br>";
        // Get the propertyID
        $propertyID = mysqli_insert_id($conn);
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    // Owners
    if (isset($_POST['owners'])) {
        foreach ($_POST['owners'] as $owner) {
            $ownerID = isset($owner['ownerID']) ? $owner['ownerID'] : 0;
            $mutation = $owner['mutation'];
            $name = $owner['name'];
            $khata_no = $owner['khata_no'];
            $remarks = $owner['remarks'];

            // Insert into Owners table
            $sql = "INSERT INTO Owners (ownerID, propertyID, mutation, name, khata_no, remarks)
                    VALUES ('$ownerID', '$propertyID', '$mutation', '$name', '$khata_no', '$remarks')";
            if (mysqli_query($conn, $sql)) {
                echo "Owner added successfully.<br>";
                $ownerID = mysqli_insert_id($conn);
            } else {
                echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            }

            // Tenants for this owner
            if (isset($owner['tenants'])) {
                foreach ($owner['tenants'] as $tenant) {
                    $tenancyID = isset($tenant['tenancyID']) ? $tenant['tenancyID'] : 0;
                    $tenant_name = $tenant['name'];
                    $tenant_khata_no = $tenant['khata_no'];
                    $tenant_remarks = $tenant['remarks'];
                    $tenant_mutation = $tenant['mutation'];

                    // Insert into Tenancy table
                    $sql = "INSERT INTO Tenancy (tenancyID, ownerID, name, khata_no, remarks, mutation)
                            VALUES ('$tenancyID', '$ownerID', '$tenant_name', '$tenant_khata_no', '$tenant_remarks', '$tenant_mutation')";
                    if (mysqli_query($conn, $sql)) {
                        echo "Tenant added successfully.<br>";
                    } else {
                        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                    }
                }
            }
        }
    }

    // CroppedArea
    if (isset($_POST['cropped_areas'])) {
        foreach ($_POST['cropped_areas'] as $crop) {
            // $cropID is AUTO_INCREMENT, so no need to specify
            $irrigated_area = isset($crop['irrigated_area']) ? $crop['irrigated_area'] : 0;
            $year = isset($crop['year']) ? $crop['year'] : 0;
            $season = $crop['season'];
            $cultivator_name = $crop['cultivator_name'];
            $crop_name = $crop['crop_name'];
            $land_not_available_for_cultivation = isset($crop['land_not_available_for_cultivation']) ? 1 : 0;
            $source_of_irrigation = $crop['source_of_irrigation'];
            $remarks = $crop['remarks'];
            $unirrigated_area = isset($crop['unirrigated_area']) ? $crop['unirrigated_area'] : 0;

            // Insert into CroppedArea table
            $sql = "INSERT INTO CroppedArea (propertyID, irrigated_area, year, season, cultivator_name, crop_name, land_not_available_for_cultivation, source_of_irrigation, remarks, unirrigated_area)
                    VALUES ('$propertyID', '$irrigated_area', '$year', '$season', '$cultivator_name', '$crop_name', '$land_not_available_for_cultivation', '$source_of_irrigation', '$remarks', '$unirrigated_area')";
            if (mysqli_query($conn, $sql)) {
                echo "Cropped area added successfully.<br>";
            } else {
                echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            }
        }
    }
}

mysqli_close($conn);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Page - Add Property Details</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        // JavaScript to add more owners
        function addOwner() {
            var ownersDiv = document.getElementById('owners');
            var ownerCount = document.querySelectorAll('.owner').length;
            var newOwnerDiv = document.createElement('div');
            newOwnerDiv.className = 'owner border p-4 mb-4';
            newOwnerDiv.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">Owner ${ownerCount + 1}</h3>
                <label class="block mb-2">Owner ID:
                    <input type="number" name="owners[${ownerCount}][ownerID]" value="0" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Mutation:
                    <input type="text" name="owners[${ownerCount}][mutation]" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Name:
                    <input type="text" name="owners[${ownerCount}][name]" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Khata No:
                    <input type="text" name="owners[${ownerCount}][khata_no]" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Remarks:
                    <textarea name="owners[${ownerCount}][remarks]" class="border p-1 w-full"></textarea>
                </label>
                <div class="tenants">
                    <h4 class="text-md font-semibold mb-2">Tenants</h4>
                    <button type="button" onclick="addTenant(this)" class="bg-blue-500 text-white px-3 py-1 rounded mb-2">Add Tenant</button>
                </div>
            `;
            ownersDiv.appendChild(newOwnerDiv);
        }

        // JavaScript to add more tenants under an owner
        function addTenant(button) {
            var tenantsDiv = button.parentNode;
            var tenantCount = tenantsDiv.querySelectorAll('.tenant').length;
            var ownerIndex = Array.from(document.querySelectorAll('.owner')).indexOf(tenantsDiv.parentNode);
            var newTenantDiv = document.createElement('div');
            newTenantDiv.className = 'tenant border p-2 mb-2';
            newTenantDiv.innerHTML = `
                <h5 class="text-sm font-semibold mb-1">Tenant ${tenantCount + 1}</h5>
                <label class="block mb-1">Tenancy ID:
                    <input type="number" name="owners[${ownerIndex}][tenants][${tenantCount}][tenancyID]" value="0" class="border p-1 w-full">
                </label>
                <label class="block mb-1">Name:
                    <input type="text" name="owners[${ownerIndex}][tenants][${tenantCount}][name]" class="border p-1 w-full">
                </label>
                <label class="block mb-1">Khata No:
                    <input type="text" name="owners[${ownerIndex}][tenants][${tenantCount}][khata_no]" class="border p-1 w-full">
                </label>
                <label class="block mb-1">Remarks:
                    <textarea name="owners[${ownerIndex}][tenants][${tenantCount}][remarks]" class="border p-1 w-full"></textarea>
                </label>
                <label class="block mb-1">Mutation:
                    <input type="text" name="owners[${ownerIndex}][tenants][${tenantCount}][mutation]" class="border p-1 w-full">
                </label>
            `;
            tenantsDiv.appendChild(newTenantDiv);
        }

        // JavaScript to add more cropped areas
        function addCroppedArea() {
            var cropsDiv = document.getElementById('cropped_areas');
            var cropCount = document.querySelectorAll('.crop').length;
            var newCropDiv = document.createElement('div');
            newCropDiv.className = 'crop border p-4 mb-4';
            newCropDiv.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">Cropped Area ${cropCount + 1}</h3>
                <label class="block mb-2">Irrigated Area:
                    <input type="number" step="0.01" name="cropped_areas[${cropCount}][irrigated_area]" value="0" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Year:
                    <input type="number" name="cropped_areas[${cropCount}][year]" value="0" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Season:
                    <input type="text" name="cropped_areas[${cropCount}][season]" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Cultivator Name:
                    <input type="text" name="cropped_areas[${cropCount}][cultivator_name]" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Crop Name:
                    <input type="text" name="cropped_areas[${cropCount}][crop_name]" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Land Not Available for Cultivation:
                    <input type="checkbox" name="cropped_areas[${cropCount}][land_not_available_for_cultivation]" class="border p-1">
                </label>
                <label class="block mb-2">Source of Irrigation:
                    <input type="text" name="cropped_areas[${cropCount}][source_of_irrigation]" class="border p-1 w-full">
                </label>
                <label class="block mb-2">Remarks:
                    <textarea name="cropped_areas[${cropCount}][remarks]" class="border p-1 w-full"></textarea>
                </label>
                <label class="block mb-2">Unirrigated Area:
                    <input type="number" step="0.01" name="cropped_areas[${cropCount}][unirrigated_area]" value="0" class="border p-1 w-full">
                </label>
            `;
            cropsDiv.appendChild(newCropDiv);
        }
    </script>
</head>
<body class="bg-gray-100 p-8">
    <form method="post" action="">
        <div class="property-details mb-8">
            <h2 class="text-2xl font-bold mb-4">Property Details</h2>
            <label class="block mb-2">Property ID:
                <input type="number" name="propertyID" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Village Name:
                <input type="text" name="village_name" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Survey No:
                <input type="text" name="survey_no" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Taluka:
                <input type="text" name="taluka" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Subdivision:
                <input type="text" name="subdivision" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Ker:
                <input type="number" step="0.01" name="ker" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Rice:
                <input type="number" step="0.01" name="rice" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Dry Crop:
                <input type="number" step="0.01" name="dry_crop" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Khazan:
                <input type="number" step="0.01" name="khazan" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Morad:
                <input type="number" step="0.01" name="morad" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Garden:
                <input type="number" step="0.01" name="garden" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Pot Kharab:
                <input type="number" step="0.01" name="pot_kharab" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Class A:
                <input type="number" step="0.01" name="class_A" value="0" class="border p-1 w-full">
            </label>
            <label class="block mb-2">Class B:
                <input type="number" step="0.01" name="class_B" value="0" class="border p-1 w-full">
            </label>
        </div>

        <div class="owners mb-8">
            <h2 class="text-2xl font-bold mb-4">Owners</h2>
            <div id="owners"></div>
            <button type="button" onclick="addOwner()" class="bg-blue-500 text-white px-4 py-2 rounded">Add Owner</button>
        </div>

        <div class="cropped-areas mb-8">
            <h2 class="text-2xl font-bold mb-4">Cropped Areas</h2>
            <div id="cropped_areas"></div>
            <button type="button" onclick="addCroppedArea()" class="bg-blue-500 text-white px-4 py-2 rounded">Add Cropped Area</button>
        </div>

        <input type="submit" value="Submit" class="bg-green-500 text-white px-6 py-3 rounded">
    </form>
</body>
</html>
