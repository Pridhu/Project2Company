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
    // On page load fetch the initial data//
    fetchDataFromPHP();

    /*******************************************************SearchBar***********************************************************************/
    var searchInput = $("#searchInput");
    searchInput.on("input", function () {
        var searchQuery = searchInput.val().trim().toLowerCase();
        var rowContainer = $("#cardRow");
        rowContainer.empty();

        // Displays the original data when the search query is empty//
        if (searchQuery === "") {
            generateCards(originalData);
            return;
        }

        var filteredData = originalData.filter(function (person) {
            
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

        generateCards(filteredData);
    });

    // Function to generate cards based on data
    function generateCards(data) {
        var rowContainer = $("#cardRow");
        // Initialize a counter to keep track of cards in the current row
        var cardCounter = 0;
        var cardsPerRow = 4;
        var numRows = Math.ceil(data.length / cardsPerRow);

        for (var i = 0; i < numRows; i++) {
            var row = $("<div class='row text-center'></div>");
            rowContainer.append(row);

            for (var j = 0; j < cardsPerRow; j++) {
                var dataIndex = i * cardsPerRow + j;

                if (dataIndex < data.length) {
                    var person = data[dataIndex];
                    var fullName = person.firstName + " " + person.lastName;

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
                    break;
                }
            }
        }
    }

    /****************************************************************Personnel Add Modal*****************************************************************/

  // Function to open the modal and trigger the AJAX call to get personnel data
  $('#personnelAddModal').on('show.bs.modal', function (e) {
    $.ajax({
        url: "Php/getPersonnelByID.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {
          var resultCode = result.status.code;
      
          if (resultCode == 200) {
            var departments = result.data.department;
            departments.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            var departmentSelect = $('#addDepartmentDropdown');
            departmentSelect.empty();

            departments.forEach(function (department) {
              var option = $('<option></option>').attr('value', department.id).text(department.name);
              departmentSelect.append(option);
              
            });
            /*console.log(result);*/
          } else {
            $('#personnelAddModal .modal-title').text("Error retrieving data");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $('#personnelAddModal .modal-title').text("Error retrieving data");
        }
      });
      
  });

  $("#exampleForm").submit(function (event) {
    event.preventDefault(); 

    // Fetch form data
    var formData = {
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      jobTitle: $("#jobTitle").val(),
      email: $("#emailAddress").val(),
      departmentID: $("#addDepartmentDropdown").val()
    };

    /*console.log("Department ID:", formData.departmentID);*/

    $.ajax({
        url: "Php/insertPersonnel.php",
        type: "POST",
        data: formData,
        success: function (response) {
          if (response.status.code === "200") {
            $('#exampleForm')[0].reset();
            /*console.log(response);*/
          } 
          // Set the employee details in the second modal's title
        $("#addAlertModal #modalTitle").text("Alert");
        $("#addAlertModal #modalBody").text("Employee details of " + formData.firstName + ", " + formData.lastName + " added successfully!");

        $("#addAlertModal").modal("show");
        $("#personnelAddModal").modal("hide");
        },
        error: function (xhr, status, error) {
          alert("An error occurred while processing the request.");
        }
      });
    });

  $('#personnelAddModal').on('shown.bs.modal', function () {
    $('#firstName').focus();
  });

  $('#personnelAddModal').on('hidden.bs.modal', function () {
    $('#exampleForm')[0].reset();
  });

});
