<?php
// Handle form submission
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

$properties = array();

if (isset($_POST['search_by_name'])) {
    // Process the 'Name' search form submission
    $owner_name = $_POST['owner_name'];
    
    $query = "SELECT * FROM property AS P, owners O WHERE O.name = '$owner_name' AND P.propertyID = O.propertyID;";
    $result = mysqli_query($conn, $query);
    
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $properties[] = $row;
        }
    }
} elseif (isset($_POST['search_by_location'])) {
    // Process the 'Location' search form submission
    echo $_POST['taluka'];
    $taluka = $_POST['taluka'];
    $village_name =  $_POST['village_name'];
    $survey_no = $_POST['survey_no'];
    $sub_div = $_POST['sub_div'];
    
    $query = "SELECT * FROM property AS P, owners O WHERE taluka = '$taluka' AND village_name = '$village_name' AND survey_no = $survey_no AND subdivision = $sub_div AND P.propertyID = O.propertyID;";
    $result = mysqli_query($conn, $query);
    
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $properties[] = $row;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Property Dashboard</title>
    <!-- Include Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">Property Dashboard</h1>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
            <!-- Property Cards Grid -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <?php foreach ($properties as $property): ?>
                    <div class="bg-white shadow rounded-md">
                        <!-- Card Header -->
                        <div class="p-4 border-b">
                            <h2 class="text-lg font-semibold"><?php echo $property['subdivision']; ?></h2>
                        </div>
                        <!-- Card Content -->
                        <div class="p-4">
                            <div class="space-y-2">
                                <!-- Location -->
                                <div class="flex items-center">
                                    <!-- MapPin Icon -->
                                    <!-- SVG code -->
                                    <span class="text-sm"><?php echo $property['location']; ?></span>
                                </div>
                                <!-- Subdivision -->
                                <div class="flex items-center">
                                    <!-- Home Icon -->
                                    <!-- SVG code -->
                                    <span class="text-sm"><?php echo $property['subdivision']; ?></span>
                                </div>
                                <!-- Owner -->
                                <div class="flex items-center">
                                    <!-- User Icon -->
                                    <!-- SVG code -->
                                    <span class="text-sm"><?php echo $property['owner']; ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>
</body>
</html>
