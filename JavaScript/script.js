$(document).ready(function () {
    var originalData;
    var employeeId;
    var filteredData;

    function fetchDataFromPHP() {
        $.ajax({
            url: "Php/getAll.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status.code === "200") {
                    originalData = response.data;
                    /*console.log(originalData);*/
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
        var rowContainer = $("#cardPersonnelRow");
        rowContainer.empty();

        // Displays the original data when the search query is empty//
        if (searchQuery === "") {
            generateCards(originalData);
            return;
        }

        filteredData = originalData.filter(function (person) {
            
            /*var employeeId= person.id.toLowerCase();*/
            var fullName = (person.firstName + " " + person.lastName).toLowerCase();
            var department = person.department.toLowerCase();
            var location = person.location.toLowerCase();
            var email = person.email.toLowerCase();
            return (
                /*employeeId.includes(searchQuery) ||*/
                fullName.includes(searchQuery) ||
                department.includes(searchQuery) ||
                location.includes(searchQuery) ||
                email.includes(searchQuery)
            );
        });

        generateCards(filteredData);

    });

    function generateCards(data) {
        var rowContainer = $("#cardPersonnelRow");
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
                        "<div class='cardPersonnelbody person-info'>" +
                        "<p> " + fullName + "</p>" +
                        "<p> " + person.department + "</p>" +
                        "<p> " + person.location + "</p>" +
                        "<p> " + person.email + "</p>" +
                        "</div>" +
                        "<div class='card-footer bg-light'>" +
                        "<button class='btn btn-link card-link btn-update' data-id='" + person.id + "'><i class='bi bi-pencil-fill'></i></button>" +
                        "<button class='btn btn-link card-link btn-trash' data-id='" + person.id + "'><i class='bi bi-trash-fill'></i></button>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    row.append(personCard);
                } else {
                    break;
                }
            }
        }
        // Attach click event listener for the "Update" button
        $(".btn-update").on("click", function() {
            employeeId = $(this).attr("data-id");
            /*console.log(employeeId);*/
            $("#personnelUpdateModal").modal('show');
        })

        // Attach click event listener for the "Trash" button
        $(".btn-trash").on("click", function() {
            employeeId = $(this).attr("data-id");
            $("#personnelRemoveModal").modal('show');
        });
    }
    
  /****************************************************************Personnel Add Modal*****************************************************************/
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

  $("#addForm").submit(function (event) {
    event.preventDefault(); 

    var formData = {
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      jobTitle: $("#jobTitle").val(),
      email: $("#emailAddress").val(),
      departmentID: $("#addDepartmentDropdown").val()
    };
    //console.log(formData);
    //console.log("Department ID:", formData.departmentID);*/

    $.ajax({
        url: "Php/insertPersonnel.php",
        type: "POST",
        data: formData,
        success: function (response) {
          if (response.status.code === "200") {
            $('#addForm')[0].reset();
            console.log(response);
            fetchDataFromPHP();
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
    $('#addForm')[0].reset();
  });

  /**********************************************************Update Personnel Modal****************************************************************************************/
    $('#personnelUpdateModal').on('show.bs.modal', function (e) {
        /*console.log("Employee ID:", employeeId);*/
        $.ajax({
            url: "Php/getPersonnelByID.php",
            type: 'GET',
            dataType: 'json',
            data: {
                id:employeeId
            },
            success: function (result) {
                //console.log(result);//
                var resultCode = result.status.code;

                if (resultCode == 200) {
                    console.log("Employee ID:", result.data.personnel[0].id);
                    console.log("First Name:", result.data.personnel[0].firstName);
                    $('#employeeId').val(result.data.personnel[0].id);
                    $('#updateFirstName').val(result.data.personnel[0].firstName);
                    $('#updateLastName').val(result.data.personnel[0].lastName);
                    $('#updateJobTitle').val(result.data.personnel[0].jobTitle);
                    $('#email').val(result.data.personnel[0].email);

                    
                    $('#updateDepartmentDropdown').empty();
                    $.each(result.data.department, function () {
                        $('#updateDepartmentDropdown').append($("<option>", {
                            value: this.id,
                            text: this.name
                        }));
                    });

                    $('#updateDepartmentDropdown').val(result.data.personnel[0].departmentID);

                    // Show the update modal after data is fetched and populated
                    $("#personnelUpdateModal").modal('show');
                } else {
                    $('#personnelUpdateModal .modal-title').text("Error retrieving data");
                }
            },
            
            error: function (jqXHR, textStatus, errorThrown) {
                $('#personnelUpdateModal .modal-title').text("Error retrieving data");
            }
        });

    });

    /*****************************************************Update function*********************************************************************************** */
    $('#updateForm').on("submit", function (e) {
        e.preventDefault();
        // Get the updated values from the form fields
        var employeeId = $('#employeeId').val();
        var updatedFirstName = $('#updateFirstName').val();
        var updatedLastName = $('#updateLastName').val();
        var updatedJobTitle = $('#updateJobTitle').val();
        var updatedEmail = $('#email').val();
        var updatedDepartmentID = $('#updateDepartmentDropdown').val();
    
        // AJAX call to update the personnel data
        $.ajax({
            url: "Php/updatePersonnel.php",
            type: 'POST', 
            dataType: 'json',
            data: {
                id: employeeId,
                firstName: updatedFirstName,
                lastName: updatedLastName,
                jobTitle: updatedJobTitle,
                email: updatedEmail,
                departmentID: updatedDepartmentID
            },
            success: function (result) {
                var resultCode = result.status.code;
                //console.log(result);//
                if (resultCode == 200) {
                    $("#updateAlertModal #modalUpdateTitle").text("Alert");
                    $("#updateAlertModal #modalUpdateBody").text("Employee details of " + updatedFirstName + ", " + updatedLastName + " updated successfully!");
                    $("#updateAlertModal").modal("show");
                    $("#personnelUpdateModal").modal('hide');
                } else {
                    $('#updateAlertModal #modalUpdateTitle').text("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error updating personnel data:", errorThrown);
            }
        });
    });

    $('#personnelUpdateModal').on('shown.bs.modal', function () {
    $('#firstName').focus(); 
    });

    $('#personnelUpdateModal').on('hidden.bs.modal', function () {  
    $('#updateForm')[0].reset();  
    });

    /*****************************************************************Remove Personnel***********************************************************************/ 
    $('#personnelRemoveModal').on('show.bs.modal', function (e) {

      $.ajax({
        url: "Php/getPersonnelByID.php",
        type: 'GET',
        dataType: 'json',
        data: {
          id: employeeId
        },
        success: function (result) {
          console.log(result);
          var resultCode = result.status.code;
  
          if (resultCode == 200) {
            //console.log("Employee ID:", result.data.personnel[0].id);//
            //console.log("First Name:", result.data.personnel[0].firstName);//
           
            var removefirstName = result.data.personnel[0].firstName;
            var removelastName = result.data.personnel[0].lastName;
            $('#deleteConfirmation').text("Are you sure you want to delete the personnel details of " + removefirstName + " " + removelastName + "?");
            deletePersonnelDetails(removefirstName,removelastName);
          } else {
            $('#personnelRemoveModal .modal-title').text("Error retrieving data");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $('#personnelRemoveModal .modal-title').text("Error retrieving data");
        }
      });
  
    });
  
    function deletePersonnelDetails (removefirstName,removelastName) {
        $(".deletePerBtn").click(function() {
            console.log('Remove Function');
        $.ajax({
            url: "Php/removePersonnelById.php",
            type: 'POST',
            dataType: 'json',
            data: {
            id: employeeId
            },
            success: function (result) {
                var resultCode = result.status.code;  
                //console.log(result);//
                if (resultCode == 200) {
                $("#removeAlertModal #modalRmoveTitle").text("Alert");
                $("#removeAlertModal #modalRemoveBody").text("Employee details of " + removefirstName + ", " + removelastName + " removed successfully!");
                $("#removeAlertModal").modal("show");
                $('#personnelRemoveModal').modal('hide');
                }else {
                    $("#removeAlertModal #modalRmoveTitle").text("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            alert("Error removing the entry. Please try again later.");
            }
        });
        });
    }
});

