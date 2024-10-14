<?php
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
    // Generate a unique propertyID
    $propertyID = uniqid();
    // Property details
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
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    // Owners
    if (isset($_POST['owners'])) {
        foreach ($_POST['owners'] as $owner) {
            $mutation = $owner['mutation'];
            $name = $owner['name'];
            $khata_no = $owner['khata_no'];
            $remarks = $owner['remarks'];

            // Insert into Owners table
            $sql = "INSERT INTO Owners (propertyID, mutation, name, khata_no, remarks)
                    VALUES ('$propertyID', '$mutation', '$name', '$khata_no', '$remarks')";
            if (mysqli_query($conn, $sql)) {
                echo "Owner added successfully.<br>";
                $ownerID = mysqli_insert_id($conn);
            } else {
                echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            }

            // Tenants for this owner
            if (isset($owner['tenants'])) {
                foreach ($owner['tenants'] as $tenant) {
                    $tenant_name = $tenant['name'];
                    $tenant_khata_no = $tenant['khata_no'];
                    $tenant_remarks = $tenant['remarks'];
                    $tenant_mutation = $tenant['mutation'];

                    // Insert into Tenancy table
                    $sql = "INSERT INTO Tenancy (ownerID, name, khata_no, remarks, mutation)
                            VALUES ('$ownerID', '$tenant_name', '$tenant_khata_no', '$tenant_remarks', '$tenant_mutation')";
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Property Details</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
    </style>
</head>
<body class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-black shadow-sm">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
            <a class="text-2xl font-bold text-white" href='./'>PROPERTY RECORDS</a>
            <nav>
                <ol class="flex items-center space-x-2 text-sm text-gray-500">
                    <li>Home</li>
                    <li>&gt;</li>
                    <li class="font-medium text-gray-200">Create Record</li>
                </ol>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <form method="post" action="" class="space-y-8">
            <!-- Accordion -->
            <div class="space-y-4">
                <!-- Property Details -->
                <div class="bg-white shadow-md rounded-lg">
                    <button type="button" class="w-full text-left px-4 py-2 text-xl font-semibold focus:outline-none" onclick="toggleAccordion('property-details')">
                        Property Details
                    </button>
                    <div id="property-details" class="p-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Property fields -->
                            <!-- Village Name -->
                            <div class="space-y-2">
                                <label for="village_name" class="block text-gray-700">Village Name *</label>
                                <input type="text" name="village_name" id="village_name" class=" border w-full border-gray-300 rounded-md shadow-sm" required>
                            </div>
                            <!-- Survey No -->
                            <div class="space-y-2">
                                <label for="survey_no" class="block text-gray-700">Survey No *</label>
                                <input type="text" name="survey_no" id="survey_no" class="border w-full border-gray-300 rounded-md shadow-sm" required>
                            </div>
                            <!-- Taluka -->
                            <div class="space-y-2">
                                <label for="taluka" class="block text-gray-700">Taluka *</label>
                                <input type="text" name="taluka" id="taluka" class="border w-full border-gray-300 rounded-md shadow-sm" required>
                            </div>
                            <!-- Subdivision -->
                            <div class="space-y-2">
                                <label for="subdivision" class="block text-gray-700">Subdivision*</label>
                                <input type="text" name="subdivision" id="subdivision" class=" border w-full border border-gray-300 rounded-md shadow-sm" required>
                            </div>
                        </div>
                        <!-- Area Cultivable-->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label for="ker" class="block text-gray-700">ker</label>
                                <input type="text" name="ker" id="ker"  min="10" max="10000" step="1" value ="0" class="border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div class="space-y-2">
                                <label for="rice" class="block text-gray-700">Rice</label>
                                <input type="text" name="rice" id="rice"  min="10" max="10000" step="1" value ="0" class="border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div class="space-y-2">
                                <label for="dry_crop" class="block text-gray-700">dry crop</label>
                                <input type="text" name="dry_crop" id="dry_crop"  min="10" max="10000" step="1" value ="0" class="border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div class="space-y-2">
                                <label for="Khazan" class="block text-gray-700">Khazan</label>
                                <input type="text" name="khazan" id="kKhazan"  min="10" max="10000" step="1" value ="0" class="border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div class="space-y-2">
                                <label for="Morad" class="block text-gray-700">Morad</label>
                                <input type="text" name="morad" id="morad"  min="10" max="10000" step="1" value ="0" class="border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div class="space-y-2">
                                <label for="Garden" class="block text-gray-700">Garden</label>
                                <input type="text" name="garden" id="garden"  min="10" max="10000" step="1"  value ="0" class="border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                        </div>
                        <!-- Area Non-Cultivable-->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label for="Pot kharab" class="block text-gray-700">Pot kharab</label>
                                <input type="text" name="pot_kharab" id="pot_kharab"  min="10" max="10000" step="1" value ="0" class=" border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div class="space-y-2">
                                <label for="Class A" class="block text-gray-700">Class A</label>
                                <input type="text" name="class_A" id="class_A"  min="10" max="10000" step="1" value ="0" class=" border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div class="space-y-2">
                                <label for="Class B" class="block text-gray-700">Class B</label>
                                <input type="text" name="class_B" id="class_B"  min="10" max="10000" step="1" value ="0" class=" border w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Owners -->
                <div class="bg-white shadow-md rounded-lg">
                    <button type="button" class="w-full text-left px-4 py-2 text-xl font-semibold focus:outline-none" onclick="toggleAccordion('owners-section')">
                        Owners
                    </button>
                    <div id="owners-section" class="p-4 hidden">
                        <div id="owners"></div>
                        <button type="button" class="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100" onclick="addOwner()">
                            <svg class="inline-block h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add Owner
                        </button>
                    </div>
                </div>

                <!-- Cropped Areas -->
                <div class="bg-white shadow-md rounded-lg">
                    <button type="button" class="w-full text-left px-4 py-2 text-xl font-semibold focus:outline-none" onclick="toggleAccordion('cropped-areas-section')">
                        Cropped Areas
                    </button>
                    <div id="cropped-areas-section" class="p-4 hidden">
                        <div id="cropped_areas"></div>
                        <button type="button" class="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100" onclick="addCroppedArea()">
                            <svg class="inline-block h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add Cropped Area
                        </button>
                    </div>
                </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-4">
                <button type="reset" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Property</button>
            </div>
        </form>
    </main>

    <!-- Help Tooltip -->
    <div class="fixed bottom-4 right-4">
        <button type="button" class="p-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 relative" id="help-btn">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 9a2.25 2.25 0 114.5 0c0 1.19-.676 2.225-1.678 2.66-.27.117-.547.19-.822.29M12 17h.01"></path>
            </svg>
            <span class="sr-only">Help</span>
            <!-- Tooltip content -->
            <div class="absolute bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-md shadow-md hidden" id="tooltip">
                Need help? Click here for assistance.
            </div>
        </button>
    </div>

    <!-- JavaScript -->
    <script>
        // Accordion toggle function
        function toggleAccordion(sectionId) {
            const section = document.getElementById(sectionId);
            section.classList.toggle('hidden');
        }

        // JavaScript to add more owners
        function addOwner() {
            var ownersDiv = document.getElementById('owners');
            var ownerCount = document.querySelectorAll('.owner').length;
            var newOwnerDiv = document.createElement('div');
            newOwnerDiv.className = 'owner border p-4 mb-4 bg-gray-50 rounded-lg';
            newOwnerDiv.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">Owner ${ownerCount + 1}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-gray-700">Mutation:
                            <input type="text" name="owners[${ownerCount}][mutation]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Name:
                            <input type="text" name="owners[${ownerCount}][name]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Khata No:
                            <input type="text" name="owners[${ownerCount}][khata_no]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2 md:col-span-2">
                        <label class="block text-gray-700">Remarks:
                            <textarea name="owners[${ownerCount}][remarks]" class="w-full border-gray-300 rounded-md shadow-sm"></textarea>
                        </label>
                    </div>
                </div>
                <h4 class="text-md font-semibold mb-2 mt-4">Tenants</h4>
                <div id="tenants-${ownerCount}"></div>
                <button type="button" class="mt-2 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100" onclick="addTenant(${ownerCount})">
                    <svg class="inline-block h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Tenant
                </button>
            `;
            ownersDiv.appendChild(newOwnerDiv);
        }

        // JavaScript to add more tenants under an owner
        function addTenant(ownerIndex) {
            var tenantsDiv = document.getElementById(`tenants-${ownerIndex}`);
            var tenantCount = tenantsDiv.querySelectorAll('.tenant').length;
            var newTenantDiv = document.createElement('div');
            newTenantDiv.className = 'tenant border p-4 mb-4 bg-white rounded-md shadow-sm';
            newTenantDiv.innerHTML = `
                <h5 class="text-sm font-semibold mb-2">Tenant ${tenantCount + 1}</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-gray-700">Name:
                            <input type="text" name="owners[${ownerIndex}][tenants][${tenantCount}][name]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Khata No:
                            <input type="text" name="owners[${ownerIndex}][tenants][${tenantCount}][khata_no]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2 md:col-span-2">
                        <label class="block text-gray-700">Remarks:
                            <textarea name="owners[${ownerIndex}][tenants][${tenantCount}][remarks]" class="w-full border-gray-300 rounded-md shadow-sm"></textarea>
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Mutation:
                            <input type="text" name="owners[${ownerIndex}][tenants][${tenantCount}][mutation]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                </div>
            `;
            tenantsDiv.appendChild(newTenantDiv);
        }

        // JavaScript to add more cropped areas
        function addCroppedArea() {
            var cropsDiv = document.getElementById('cropped_areas');
            var cropCount = document.querySelectorAll('.crop').length;
            var newCropDiv = document.createElement('div');
            newCropDiv.className = 'crop border p-4 mb-4 bg-gray-50 rounded-lg';
            newCropDiv.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">Cropped Area ${cropCount + 1}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-gray-700">Irrigated Area:
                            <input type="number" step="0.01" name="cropped_areas[${cropCount}][irrigated_area]" value="0" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Year:
                            <input type="number" name="cropped_areas[${cropCount}][year]" value="0" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Season:
                            <input type="text" name="cropped_areas[${cropCount}][season]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Cultivator Name:
                            <input type="text" name="cropped_areas[${cropCount}][cultivator_name]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Crop Name:
                            <input type="text" name="cropped_areas[${cropCount}][crop_name]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="block text-gray-700">Land Not Available for Cultivation:</label>
                        <input type="checkbox" name="cropped_areas[${cropCount}][land_not_available_for_cultivation]" class="h-4 w-4 text-blue-600">
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Source of Irrigation:
                            <input type="text" name="cropped_areas[${cropCount}][source_of_irrigation]" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                    <div class="space-y-2 md:col-span-2">
                        <label class="block text-gray-700">Remarks:
                            <textarea name="cropped_areas[${cropCount}][remarks]" class="w-full border-gray-300 rounded-md shadow-sm"></textarea>
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-700">Unirrigated Area:
                            <input type="number" step="0.01" name="cropped_areas[${cropCount}][unirrigated_area]" value="0" class="w-full border-gray-300 rounded-md shadow-sm">
                        </label>
                    </div>
                </div>
            `;
            cropsDiv.appendChild(newCropDiv);
        }

        // Accordion toggle function
        function toggleAccordion(sectionId) {
            const section = document.getElementById(sectionId);
            section.classList.toggle('hidden');
        }

        // Tooltip
        const helpBtn = document.getElementById('help-btn');
        const tooltip = document.getElementById('tooltip');
        helpBtn.addEventListener('mouseenter', () => {
            tooltip.classList.remove('hidden');
        });
        helpBtn.addEventListener('mouseleave', () => {
            tooltip.classList.add('hidden');
        });
    </script>
</body>
</html>
