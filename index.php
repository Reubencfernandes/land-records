<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Property Records</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background-image: url('https://cdn.midjourney.com/57d036ee-e34e-4b99-81c7-0b6e138c0dc4/0_0.png');
            background-size: cover;
        }
    </style>
</head>
<body class="text-white">

    <!-- Navbar -->
    <nav class="bg-black py-4">
        <div class="flex items-center mx-auto justify-between pl-10 pr-10">
            <h1 class="text-4xl font-bold">PROPERTY RECORD</h1>
            <div class='pl-4 hover:text-red'>
                <a href='insert.php' class='pr-4 pl-4'>Add Record</a>
                <a href='insert.php'>Show Records</a>
            </div>
        </div> <!-- Added missing closing div tag -->
    </nav>

    <div class="container mx-auto py-8 px-4">
        <!-- Title -->
        <div class="text-center mb-6">
            <h1 class="text-4xl font-bold mb-2">Property Records</h1>
            <p class="text-center text-xl mb-6">Quickly find property information using our fast and efficient search tools.</p>
        </div>

        <!-- Forms Container -->
        <div class="max-w-3xl mx-auto">
            <!-- Combined Form Layout -->
            <div class="flex items-center justify-center mb-4">
                <form id="searchForm" action="showsearched.php" method="post" class="flex items-center w-full">
                    <!-- Search Option Selector -->
                    <select id="searchOption" class="text-black py-3 px-4 rounded-md">
                        <option value="name">Name</option>
                        <option value="location">Location</option>
                    </select>

                    <!-- Name Search Inputs -->
                    <div id="nameInputs" class="flex items-center ml-2 w-full">
                        <input type="text" name="owner_name" class="bg-white text-black border-none py-3 px-4 w-full rounded-md" placeholder="Enter the property owner's name">
                    </div>

                    <!-- Location Search Inputs -->
                    <div id="locationInputs" class="flex items-center ml-2 w-full hidden gap-4">
                        <input type="text" name="taluka" class="bg-white text-black border-none py-3 px-4 w-full rounded-md" placeholder="Taluka">
                        <input type="text" name="village_name" class="bg-white text-black border-none py-3 px-4 w-full rounded-md" placeholder="Village Name">
                        <input type="text" name="survey_no" class="bg-white text-black border-none py-3 px-4 w-full rounded-md" placeholder="Survey No">
                        <input type="text" name="sub_div" class="bg-white text-black border-none py-3 px-4 w-full rounded-md" placeholder="Sub Div">
                    </div>

                    <!-- Search Button -->
                    <button id="searchButton" type="submit" name="search_by_name" class="bg-green-500 text-white py-3 px-8 rounded-md ml-2">Search</button>
                </form>
            </div>
        </div>
    </div>

    <!-- JavaScript to toggle inputs -->
    <script>
        const searchOption = document.getElementById('searchOption');
        const nameInputs = document.getElementById('nameInputs');
        const locationInputs = document.getElementById('locationInputs');
        const searchButton = document.getElementById('searchButton');

        searchOption.addEventListener('change', function () {
            if (this.value === 'name') {
                nameInputs.classList.remove('hidden');
                locationInputs.classList.add('hidden');
                searchButton.setAttribute('name', 'search_by_name');
            } else {
                nameInputs.classList.add('hidden');
                locationInputs.classList.remove('hidden');
                searchButton.setAttribute('name', 'search_by_location');
            }
        });
    </script>

</body>
</html>
