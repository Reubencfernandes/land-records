<?php
// Step 1: Database connection setup
$host = 'localhost';
$dbname = 'property_database'; // Adjust based on your database name
$username = 'root';
$password = '';

$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Step 2: Retrieve the property ID from the URL
$propertyID = $_GET['propertyid'] ?? null;

if ($propertyID) {
    // Fetch property data
    $sql_property = "SELECT * FROM property WHERE propertyID = $propertyID";
    $result_property = mysqli_query($conn, $sql_property);
    $property = mysqli_fetch_assoc($result_property);

    if (!$property) {
        die("Property not found");
    }

    // Fetch owners data
    $sql_owners = "SELECT * FROM owners WHERE propertyID = $propertyID";
    $result_owners = mysqli_query($conn, $sql_owners);
    $owners = [];
    while ($row = mysqli_fetch_assoc($result_owners)) {
        $owners[] = $row;
    }

    // Fetch tenancy data
    $ownerIDs = array_column($owners, 'ownerID');
    $ownerIDs_str = implode(',', $ownerIDs);
    if (!empty($ownerIDs_str)) {
        $sql_tenancy = "SELECT * FROM tenancy WHERE ownerID IN ($ownerIDs_str)";
        $result_tenancy = mysqli_query($conn, $sql_tenancy);
        $tenancies = [];
        while ($row = mysqli_fetch_assoc($result_tenancy)) {
            $tenancies[] = $row;
        }
    } else {
        $tenancies = [];
    }

    // Fetch cropped area data
    $sql_cropped_area = "SELECT * FROM croppedarea WHERE propertyID = $propertyID";
    $result_cropped_area = mysqli_query($conn, $sql_cropped_area);
    $cropped_areas = [];
    while ($row = mysqli_fetch_assoc($result_cropped_area)) {
        $cropped_areas[] = $row;
    }
} else {
    die("Invalid Property ID");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Property Details</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-center mb-10">Property Details</h1>
        <div class="bg-white shadow-lg rounded-lg p-8">
            <!-- Property Details -->
            <h2 class="text-2xl font-semibold mb-4">Property Information</h2>
            <table class="table-auto w-full mb-8">
                <tbody>
                    <?php foreach ($property as $key => $value): ?>
                        <tr>
                            <td class="border px-4 py-2 font-semibold"><?php echo htmlspecialchars(ucwords(str_replace('_', ' ', $key))); ?></td>
                            <td class="border px-4 py-2"><?php echo htmlspecialchars($value); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <!-- Owners Details -->
            <h2 class="text-2xl font-semibold mb-4">Owners</h2>
            <?php if (!empty($owners)): ?>
                <?php foreach ($owners as $owner): ?>
                    <div class="mb-4">
                        <table class="table-auto w-full mb-4">
                            <tbody>
                                <?php foreach ($owner as $key => $value): ?>
                                    <tr>
                                        <td class="border px-4 py-2 font-semibold"><?php echo htmlspecialchars(ucwords(str_replace('_', ' ', $key))); ?></td>
                                        <td class="border px-4 py-2"><?php echo htmlspecialchars($value); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No owners found.</p>
            <?php endif; ?>

            <!-- Tenancy Details -->
            <h2 class="text-2xl font-semibold mb-4">Tenancy</h2>
            <?php if (!empty($tenancies)): ?>
                <?php foreach ($tenancies as $tenancy): ?>
                    <div class="mb-4">
                        <table class="table-auto w-full mb-4">
                            <tbody>
                                <?php foreach ($tenancy as $key => $value): ?>
                                    <tr>
                                        <td class="border px-4 py-2 font-semibold"><?php echo htmlspecialchars(ucwords(str_replace('_', ' ', $key))); ?></td>
                                        <td class="border px-4 py-2"><?php echo htmlspecialchars($value); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No tenancy records found.</p>
            <?php endif; ?>

            <!-- Cropped Area Details -->
            <h2 class="text-2xl font-semibold mb-4">Cropped Areas</h2>
            <?php if (!empty($cropped_areas)): ?>
                <?php foreach ($cropped_areas as $crop): ?>
                    <div class="mb-4">
                        <table class="table-auto w-full mb-4">
                            <tbody>
                                <?php foreach ($crop as $key => $value): ?>
                                    <tr>
                                        <td class="border px-4 py-2 font-semibold"><?php echo htmlspecialchars(ucwords(str_replace('_', ' ', $key))); ?></td>
                                        <td class="border px-4 py-2"><?php echo htmlspecialchars($value); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No cropped area records found.</p>
            <?php endif; ?>

            <a href="index.php" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Back</a>
        </div>
    </div>
</body>
</html>
<?php
// Close the database connection
mysqli_close($conn);
?>
