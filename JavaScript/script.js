$(document).ready(function () {
    // Store the original data fetched from PHP
    var originalData;

    function fetchDataFromPHP() {
        $.ajax({
            url: "Php/getAll.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status.code === "200") {
                    originalData = response.data;
                    generateCards(originalData);
                } else {
                    console.error("Error: Unable to fetch data from PHP.");
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            }
        });
    }

    // Initial data fetch when the page loads
    fetchDataFromPHP();

    /*******************************************************SearchBar***********************************************************************/
    var searchInput = $("#searchInput");
    searchInput.on("input", function () {
        var searchQuery = searchInput.val().trim().toLowerCase();
        var rowContainer = $("#cardRow");

        // Clear the existing rows
        rowContainer.empty();

        // If the search query is empty, display all the original data
        if (searchQuery === "") {
            generateCards(originalData);
            return;
        }

        var filteredData = originalData.filter(function (person) {
            // Filter the data based on the search query
            var fullName = (person.firstName + " " + person.lastName).toLowerCase();
            var department = person.department.toLowerCase();
            var location = person.location.toLowerCase();
            var email = person.email.toLowerCase();
            return (
                fullName.includes(searchQuery) ||
                department.includes(searchQuery) ||
                location.includes(searchQuery) ||
                email.includes(searchQuery)
            );
        });

        // Generate cards for the filtered data
        generateCards(filteredData);
    });

    // Function to generate cards based on data
    function generateCards(data) {
        var rowContainer = $("#cardRow");

        // Initialize a counter to keep track of cards in the current row
        var cardCounter = 0;
        var cardsPerRow = 4;

        var numRows = Math.ceil(data.length / cardsPerRow);

        // Create a for loop to generate the cards and manage rows
        for (var i = 0; i < numRows; i++) {
            // Create a new row
            var row = $("<div class='row text-center'></div>");

            rowContainer.append(row);

            // Create cards for each person in this row
            for (var j = 0; j < cardsPerRow; j++) {
                var dataIndex = i * cardsPerRow + j;

                if (dataIndex < data.length) {
                    var person = data[dataIndex];
                    var fullName = person.firstName + " " + person.lastName;

                    // Create a new card for the person's information
                    var personCard =
                        "<div class='col-md-3'>" +
                        "<div class='card border-secondary mb-3'>" +
                        "<div class='card-body person-info'>" +
                        "<p> " + fullName + "</p>" +
                        "<p> " + person.department + "</p>" +
                        "<p> " + person.location + "</p>" +
                        "<p> " + person.email + "</p>" +
                        "</div>" +
                        "<div class='card-footer bg-light'>" +
                        "<button class='btn btn-link card-link btn-trash'><i class='bi bi-trash-fill'></i></button>" +
                        "<button class='btn btn-link card-link'><i class='bi bi-pencil-fill'></i></button>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    row.append(personCard);
                } else {
                    // If we have run out of data, break out of the loop
                    break;
                }
            }
        }
    }
});