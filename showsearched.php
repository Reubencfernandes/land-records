<?php
// Step 1: Database connection setup
$host = 'localhost';
$dbname = 'property_database'; // Adjust based on your database name
$username = 'root'; // Database username
$password = ''; // Database password

$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Step 2: Query to fetch data from the 'property' table
$sql = "SELECT propertyid, location, owner_name FROM property";
$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Records</title>
    <script src="https://cdn.tailwindcss.com"></script> <!-- Including TailwindCSS -->
</head>
<body class="bg-gray-100">

<div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-10">PROPERTY RECORDS</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <?php
        if (mysqli_num_rows($result) > 0) {
            while ($property = mysqli_fetch_assoc($result)) {
                ?>
                <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                    <img class="w-full h-48 object-cover" src="default_image.jpg" alt="Property Image">
                    <div class="p-4">
                        <h2 class="text-xl font-semibold mb-2">Location: <?php echo htmlspecialchars($property['location']); ?></h2>
                        <p class="text-gray-700">Owner: <?php echo htmlspecialchars($property['owner_name']); ?></p>
                        <p class="text-gray-500 text-sm">Property ID: <?php echo htmlspecialchars($property['propertyid']); ?></p>
                        <button class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                            View
                        </button>
                    </div>
                </div>
                <?php
            }
        } else {
            ?>
            <p class="text-center text-gray-500">No properties found.</p>
            <?php
        }
        ?>
    </div>
</div>

</body>
</html>

<?php
// Step 3: Close the database connection
mysqli_close($conn);
?>
