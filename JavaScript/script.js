$(document).ready(function() {
    function fetchDataFromPHP() {
        $.ajax({
            url: "Php/getAll.php", // Replace with the actual path to your PHP file
            type: "GET",
            dataType: "json",
            success: function(response) {
                // Handle the response from PHP
                if (response.status.code === "200") { // Check for the "status" code
                    // Assuming the response contains the data you want to insert into the card body
                    var data = response.data;
                    console.log(data); // Make sure you have the data in the console

                    // Get the row container to append cards
                    var rowContainer = $("#cardRow");

                    // Clear any previous content
                    rowContainer.empty();

                    // Initialize a counter to keep track of cards in the current row
                    var cardCounter = 0;

                    // Iterate through the data array and create HTML elements for each person
                    data.forEach(function(person) {
                        var fullName = person.firstName + " " + person.lastName;

                        // Create a new card for the person's information
                        var personCard = "<div class='col-sm-3'>" +
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

                        // Append the personCard HTML to the row container
                        rowContainer.append(personCard);

                        // Increment the card counter
                        cardCounter++;

                        // Check if we have added four cards, and create a new row if needed
                        if (cardCounter === 4) {
                            rowContainer.append('<div class="w-100"></div>'); // Add a new row by inserting a div with "w-100" class
                            cardCounter = 0; // Reset the card counter for the next row
                        }
                    });
                } else {
                    console.error("Error: Unable to fetch data from PHP.");
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", status, error);
            }
        });
    }

    // Initial data fetch when the page loads
    fetchDataFromPHP();
});