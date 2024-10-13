<?php
$db_exists = false;
// database info
$servername = "localhost";
$username = "root";     
$password = "";        

$conn = mysqli_connect($servername, $username, $password);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
// directly selecting database query was having issues so it seems like we have to use this query
$sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'PropertyDB'";
$result = mysqli_query($conn, $sql);

// check if db exists
if (mysqli_num_rows($result) > 0) {
    $db_exists = true;
} else {
    $db_exists = false;
}
// get form and check if db exists
if (isset($_POST['create']) && $db_exists == false) {
    $sql = "CREATE DATABASE PropertyDB";
    if (mysqli_query($conn, $sql)) {
        echo "Database 'PropertyDB' created successfully.<br>";
    } else {
        echo "Error creating database: " . mysqli_error($conn) . "<br>";
    }
    mysqli_select_db($conn, 'PropertyDB');
    $sql = "CREATE TABLE Property (
    propertyID INT PRIMARY KEY,
    village_name VARCHAR(100),
    survey_no VARCHAR(50),
    taluka VARCHAR(100),
    subdivision VARCHAR(50),
    location VARCHAR(255) GENERATED ALWAYS AS (
        CONCAT(village_name, ', ', taluka, ', ', subdivision, ', Survey No: ', survey_no)
    ) VIRTUAL,
    ker DECIMAL(10,2),
    rice DECIMAL(10,2),
    dry_crop DECIMAL(10,2),
    khazan DECIMAL(10,2),
    morad DECIMAL(10,2),
    garden DECIMAL(10,2),
    total_uncultivable_area DECIMAL(10,2) GENERATED ALWAYS AS (
        ker + rice + dry_crop + khazan + morad + garden
    ) VIRTUAL,
    pot_kharab DECIMAL(10,2),
    class_A DECIMAL(10,2),
    class_B DECIMAL(10,2),
    total_cultivable_area DECIMAL(10,2) GENERATED ALWAYS AS (
        pot_kharab + class_A + class_B
    ) VIRTUAL
);";
        
    if (mysqli_query($conn, $sql)) {
        echo "Table 'Property' created successfully.<br>";
    } else {
        echo "Error creating table 'Property': " . mysqli_error($conn) . "<br>";
    }
    $sql = "CREATE TABLE Owners (
        ownerID INT  PRIMARY KEY,
        propertyID INT,
        mutation VARCHAR(100),
        name VARCHAR(255),
        khata_no VARCHAR(50),
        remarks TEXT,
        FOREIGN KEY (propertyID) REFERENCES Property(propertyID))";
    if (mysqli_query($conn, $sql)) {
        echo "Table 'Owners' created successfully.<br>";
    } else {
        echo "Error creating table 'Owners': " . mysqli_error($conn) . "<br>";
    }

    $sql = "CREATE TABLE Tenancy (
        tenancyID INT PRIMARY KEY,
        ownerID INT,
        name VARCHAR(255),
        khata_no VARCHAR(50),
        remarks TEXT,
        mutation VARCHAR(100),
        FOREIGN KEY (ownerID) REFERENCES Owners(ownerID))";
    if (mysqli_query($conn, $sql)) {
        echo "Table 'Tenancy' created successfully.<br>";
    } else {
        echo "Error creating table 'Tenancy': " . mysqli_error($conn) . "<br>";
    }

    $sql = "CREATE TABLE CroppedArea (
        cropID INT AUTO_INCREMENT PRIMARY KEY,
        propertyID INT,
        irrigated_area DECIMAL(10,2),
        year INT,
        season VARCHAR(50),
        cultivator_name VARCHAR(255),
        crop_name VARCHAR(255),
        land_not_available_for_cultivation BOOLEAN,
        source_of_irrigation VARCHAR(100),
        remarks TEXT,
        unirrigated_area DECIMAL(10,2),
        FOREIGN KEY (propertyID) REFERENCES Property(propertyID))";
    if (mysqli_query($conn, $sql)) {
        echo "Table 'CroppedArea' created successfully.<br>";
    } else {
        echo "Error creating table 'CroppedArea': " . mysqli_error($conn) . "<br>";
    }
    $db_exists = true;
}
mysqli_close($conn);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Create PropertyDB Database and Tables</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex items-center justify-center min-h-screen bg-gray-100">
    <?php if ($db_exists == false){ 
        echo '<form method="post" action="">
            <input type="submit" name="create" value="Create Database and Tables" class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
        </form>';
    }else{ 
        echo '<p class="text-green-600 font-semibold">Database and tables have been successfully created.</p>';
    }
    ?>
</body>
</html>

