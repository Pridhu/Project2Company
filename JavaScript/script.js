$(document).ready(function () {
    var originalData;
    var employeeId;
    var departmentId;
    var departmentRemoveName;
    var locationId;
    var locationRemoveName;

    function fetchPersonnelData(searchQuery = "") {
        $.ajax({
            url: "Php/getAll.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status.code === "200") {
                    originalData = response.data;
                    /*console.log(originalData);*/
        
                    // If a search query is provided, filter the data
                    if (searchQuery.trim() !== "") {
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
                    } else {
                        generateCards(originalData);
                    }
                } else {
                    console.error("Error: Unable to fetch data from PHP.");
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            }
        });
    }

    // On page load fetch the initial data
    fetchPersonnelData();

    /*******************************************************SearchBarPersonnel***********************************************************************/
    var searchPersonnelInput = $("#searchPersonnelInput");
    searchPersonnelInput.on("input", function () {
        var searchQuery = searchPersonnelInput.val().trim().toLowerCase();
        var rowContainer = $("#cardPersonnelRow");
        rowContainer.empty();
        fetchPersonnelData(searchQuery);
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
                    //console.log(person);
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
                        "<button class='btn btn-link card-link btn-update' data-type='personnel' data-id='" + person.id + "'><i class='bi bi-pencil-fill'></i></button>" +
                        "<button class='btn btn-link card-link btn-trash' data-type='personnel' data-id='" + person.id + "'><i class='bi bi-trash-fill'></i></button>" +
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
            var type = $(this).data("type");
            employeeId = $(this).attr("data-id");
            /*console.log(employeeId);*/
            if (type === "personnel") {
                
                $("#personnelUpdateModal").modal('show');
            }
        })
        // Attach click event listener for the "Trash" button
        $(".btn-trash").on("click", function() {
            var type = $(this).data("type");
            employeeId = $(this).attr("data-id");
            if (type === "personnel") {
                $("#personnelRemoveModal").modal('show');
            }
        });
    }
    
    /********************************************************Department*********************************************************************************/
    function fetchDepartmentData(searchQuery = "") {
        $.ajax({
            url: "Php/getAllDepartments.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status.code === "200") {
                    var departmentData = response.data;
                    //var departmentName = response.data[0].name;
                    //console.log(departmentData);
                    //console.log(departmentName);
        
                    // If a search query is provided, filter the data
                    if (searchQuery.trim() !== "") {
                        var filteredDepartment = departmentData.filter(function (department) {
                            var departmentName = department.name.toLowerCase();
                            return departmentName.includes(searchQuery);
                        });
                        generateDepartmentCards(filteredDepartment);
                    } else {
                        generateDepartmentCards(departmentData);
                    }
                } else {
                    console.error("Error: Unable to fetch data from PHP.");
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            }
        });
    }

    // On page load fetch the initial data
    fetchDepartmentData();

    /*******************************************************SearchBarDepartment***********************************************************************/
    var searchDepartmentInput = $("#searchDepartmentInput");
    searchDepartmentInput.on("input", function () {
        var searchQuery = searchDepartmentInput.val().trim().toLowerCase();
        var rowContainer = $("#cardDepartmentRow");
        rowContainer.empty();
        fetchDepartmentData(searchQuery);
    });

    function  generateDepartmentCards(data) {
        var rowContainer = $("#cardDepartmentRow");
        // Initialize a counter to keep track of cards in the current row
        var cardCounter = 0;
        var cardsPerRow = 2;
        var numRows = Math.ceil(data.length / cardsPerRow);

        for (var i = 0; i < numRows; i++) {
            var row = $("<div class='row text-center justify-content-center'></div>");
            rowContainer.append(row);

            for (var j = 0; j < cardsPerRow; j++) {
                var dataIndex = i * cardsPerRow + j;

                if (dataIndex < data.length) {
                    var department = data[dataIndex];
                    //console.log(department);
                    var departmentName = department.name;
                    //console.log(departmentName);
                    //var departmentName = data[dataIndex].name;
                    //console.log(departmentName);
                    //var departmentId = data[dataIndex].id;
                    //console.log(departmentId);
                    var departmentCard =
                        "<div class='col-md-3'>" +
                        "<div class='card border-secondary mb-3'>" +
                        "<div class='cardDepartmentbody department-info'>" +
                        "<p> " + departmentName + "</p>" +
                        "</div>" +
                        "<div class='card-footer bg-light'>" +
                        "<button class='btn btn-link card-link btn-update' data-type='department' data-department-id='" + department.id + "'><i class='bi bi-pencil-fill'></i></button>" +
                        "<button class='btn btn-link card-link deleteDeptBtn btn-trash'  data-type='department' data-department-id='" + department.id + "' data-department-name='" + departmentName + "'><i class='bi bi-trash-fill'></i></button>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    row.append(departmentCard);
                } else {
                    break;
                }
            }
        }

        // Attach click event listener for the "Update" button
        $(".btn-update").on("click", function() {
            var type = $(this).data("type");
            departmentId = $(this).attr("data-department-id");
            console.log(departmentId);
            if (type === "department") {
            $("#departmentUpdateModal").modal('show');
            }
        })

        // Attach click event listener for the "Trash" button
        $(".btn-trash").on("click", function() {
            var type = $(this).data("type");
           if (type === "department") {
            departmentId = $(this).attr("data-department-id");
            //console.log('Button on click id');
            //console.log(departmentId);
            departmentRemoveName= $(this).attr("data-department-name");
            //console.log(departmentRemoveName);
            checkDepartmentDetails ();
        }
        });
    }

  /***********************************************************Location*********************************************************************************/ 
    function fetchLocationData(searchQuery = "") {
        $.ajax({
            url: "Php/getAllLocations.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status.code === "200") {
                    var locationData = response.data;
                    //var locationName = response.data[0].name;
                    //console.log(locationData);
                    //console.log(locationName);
        
                    // Search query to filter the data
                    if (searchQuery.trim() !== "") {
                        var filteredLocation = locationData.filter(function (location) {
                            var locationName = location.name.toLowerCase();
                            return locationName.includes(searchQuery);
                        });
                        generateLocationCards(filteredLocation);
                    } else {
                        generateLocationCards(locationData);
                    }
                } else {
                    console.error("Error: Unable to fetch data from PHP.");
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            }
        });
    }

    // On page load fetch the initial data
    fetchLocationData();

    /*******************************************************SearchBarLocation***********************************************************************/
    var searchLocationInput = $("#searchLocationInput");
    searchLocationInput.on("input", function () {
        var searchQuery = searchLocationInput.val().trim().toLowerCase();
        var rowContainer = $("#cardLocationRow");
        rowContainer.empty();
        fetchLocationData(searchQuery);
    });

    function  generateLocationCards(data) {
        var rowContainer = $("#cardLocationRow");
        // Initialize a counter to keep track of cards in the current row
        var cardCounter = 0;
        var cardsPerRow = 2;
        var numRows = Math.ceil(data.length / cardsPerRow);

        for (var i = 0; i < numRows; i++) {
            var row = $("<div class='row text-center justify-content-center'></div>");
            rowContainer.append(row);

            for (var j = 0; j < cardsPerRow; j++) {
                var dataIndex = i * cardsPerRow + j;

                if (dataIndex < data.length) {
                    var location = data[dataIndex];
                    //console.log(location);
                    var locationName = location.name;
                    //console.log(locationName);
                    //var locationName = data[dataIndex].name;
                    //console.log(locationName);
                    //var locationId = data[dataIndex].id;
                    //console.log(locationId);
                    var locationCard =
                        "<div class='col-md-3'>" +
                        "<div class='card border-secondary mb-3'>" +
                        "<div class='cardDepartmentbody department-info'>" +
                        "<p> " + locationName + "</p>" +
                        "</div>" +
                        "<div class='card-footer bg-light'>" +
                        "<button class='btn btn-link card-link btn-updatelocation' data-type='location' data-location-id='" + location.id + "'><i class='bi bi-pencil-fill'></i></button>" +
                        "<button class='btn btn-link card-link deleteDeptBtn btn-trash'  data-type='location' data-location-id='" + location.id + "' data-location-name='" + locationName + "'><i class='bi bi-trash-fill'></i></button>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    row.append(locationCard);
                } else {
                    break;
                }
            }
        }

        // Attach click event listener for the "Update" button
        $(".btn-updatelocation").on("click", function() {
            var type = $(this).data("type");
            locationId = $(this).attr("data-location-id");
            console.log(locationId);
            if (type === "location") {
            $("#locationUpdateModal").modal('show');
            }
        })

        // Attach click event listener for the "Trash" button
        $(".btn-trash").on("click", function() {
            var type = $(this).data("type");
           if (type === "location") {
            locationId = $(this).attr("data-location-id");
            //console.log('Button on click id');
            //console.log(locationId);
            locationRemoveName= $(this).attr("data-location-name");
            //console.log(locationRemoveName);
            checkLocationDetails ();
        }
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
            fetchPersonnelData();
          } 
          // Set the employee details in the second modal's title
        $("#addAlertModal #modalTitle").text("Alert");
        $("#addAlertModal #modalBody").html("Employee details of <strong>" + formData.firstName + "</strong>, <strong>" + formData.lastName + "</strong> added successfully!");

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

    /*****************************************************Update Personnel function*********************************************************************************** */
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
                    $("#updateAlertModal #modalUpdateBody").html("Employee details of <strong>" + updatedFirstName + "</strong>, <strong>" + updatedLastName + "</strong> updated successfully!");
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
            $('#deleteConfirmation').html("Are you sure you want to delete the personnel details of <strong>" + removefirstName + "</strong>, <strong>" + removelastName + "</strong>?");
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
                    $("#removeAlertModal #modalRemoveBody").html("Employee details of <strong>" + removefirstName + "</strong>, <strong>" + removelastName + "</strong> removed successfully!");
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
     /*****************************************************************Add Department***********************************************************************/ 
    $('#departmentAddModal').on('show.bs.modal', function (e) {
       // console.log('hi');
        $.ajax({
            url: "Php/getAllLocations.php",
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                var resultCode = result.status.code;
            
                if (resultCode == 200) {
                    var locations = result.data;
                    //console.log(locations);
                    var locationSelect = $('#addLocationDropdown');
                    locationSelect.empty();
        
                    locations.forEach(function (location) {
                    var option = $('<option></option>').attr('value', location.id).text(location.name);
                    locationSelect.append(option);    
                    });    
                } else {
                    $('#departmentAddModal .modal-title').text("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              $('#departmentAddModal .modal-title').text("Error retrieving data");
            }
        });     
    });
    
    $("#addDepartmentForm").submit(function (event) {
    event.preventDefault(); 

        var departmentName = $("#departmentName").val();
        var locationId = $("#addLocationDropdown").val();
        //console.log(departmentName);
        //console.log(locationId);

    $.ajax({
        url: "Php/insertDepartment.php",
        type: "POST",
        data: {
        name: departmentName,   // Include the department name in the data payload
        locationID: locationId, 
        },
        success: function (response) {
            if (response.status.code === "200") {
            $('#addDepartmentForm')[0].reset();
            //console.log(response);
            fetchDepartmentData();
            } 
        
        $("#addDepartmentAlertModal #modalDptAlertTitle").text("Alert");
        $("#addDepartmentAlertModal #modalDptAlerBody").html("Department <strong>" + departmentName + "</strong> added successfully!");
        $("#addDepartmentAlertModal").modal("show");
        $("#departmentAddModal").modal("hide");
        },
        error: function (xhr, status, error) {
            alert("An error occurred while processing the request.");
        }
        });
    });

    $('#departmentAddModal').on('shown.bs.modal', function () {
    $('#departmentName').focus();
    });

    $('#departmentAddModal').on('hidden.bs.modal', function () {
    $('#addDepartmentForm')[0].reset();
    });

    /**********************************************************Update Department Modal****************************************************************************************/
    $('#departmentUpdateModal').on('show.bs.modal', function (e) {
        //var departmentId = $(this).data("department-id");
        //console.log("Department ID:", departmentId);
        $.ajax({
            url: "Php/getDepartmentByID.php",
            type: 'GET',
            dataType: 'json',
            data: {
                id:departmentId
            },
            success: function (result) {
                //console.log(result);//
                var resultCode = result.status.code;

                if (resultCode == 200) {
                    //console.log(result);
                   //console.log("Department Name:", result.data[0].name);
                   //console.log("Department Id:", result.data[0].id);
                    $('#departmentID').val(result.data[0].id);
                   $('#updateDepartmentName').val(result.data[0].name);
                
                    $('#updateLocationDropdown').empty();
                    $.each(result.data.location, function () {
                        $('#updateLocationDropdown').append($("<option>", {
                            value: this.id,
                            text: this.name
                        }));
                    });

                    $('#updateLocationDropdown').val(result.data[0].locationID);

                    // Show the update modal after data is fetched and populated
                    $("#departmentUpdateModal").modal('show');
                } else {
                    $('#departmentUpdateModal .modal-title').text("Error retrieving data");
                }
            },
            
            error: function (jqXHR, textStatus, errorThrown) {
                $('#departmentUpdateModal .modal-title').text("Error retrieving data");
            }
        });

    });

    /*****************************************************Update function*********************************************************************************** */
    $('#updateDepartmentForm').on("submit", function (e) {
        e.preventDefault();
        // Get the updated values from the form fields
        var departmentId = $('#departmentID').val();
        var updatedDepartmentName = $('#updateDepartmentName').val();
        var updatedLocationID = $('#updateLocationDropdown').val();
        //console.log(departmentId);
        console.log(updatedDepartmentName);
        console.log(updatedLocationID);

        // AJAX call to update the personnel data
        $.ajax({
            url: "Php/updateDepartment.php",
            type: 'POST', 
            dataType: 'json',
            data: {
                id: departmentId,
                name: updatedDepartmentName,
                locationID: updatedLocationID
            },
            success: function (result) {
                var resultCode = result.status.code;
                //console.log(result);//
                
                if (resultCode == 200) {
                    $("#updateDepartmentAlertModal #modalDptUpdateTitle").text("Alert");
                    $("#updateDepartmentAlertModal #modalDptUpdateBody").html("Department <strong>" + updatedDepartmentName + "</strong> updated successfully!");
                    $("#updateDepartmentAlertModal").modal("show");
                    $("#departmentUpdateModal").modal('hide');
                } else {
                    $('#updateDepartmentAlertModal #modalDptUpdateTitle').text("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error updating department data:", errorThrown);
            }
        });
    });

    $('#departmentUpdateModal').on('shown.bs.modal', function () {
    $('#updateDepartmentForm').focus(); 
    });

    $('#departmentUpdateModal').on('hidden.bs.modal', function () {  
    $('#updateDepartmentForm')[0].reset();  
    });

    /*****************************************************************Remove Department***********************************************************************/  
    function checkDepartmentDetails () {
        //console.log('hi'); 
        //console.log(departmentRemoveName);
        //$(".deleteDeptBtn").click(function() {

        $.ajax({
            url: "Php/checkDepartment.php",
            type: 'POST',
            dataType: 'json',
            data: {
              id: departmentId,
            },
            success: function (result) {
                //console.log(result);       
              if (result.status.code == 200) {
               //console.log('Value of departmentRemoveName:', departmentRemoveName);
                if (result.data.personnelCount == 0) {
                  $("#areYouSureDeptName").text(departmentRemoveName);
                  $('#areYouSureDeleteDepartmentModal').modal("show");
                  deleteDepartmentDetails(departmentId); 
                
                } else {
                  //console.log(result.data.personnelCount);
                  $("#pc").text(result.data.personnelCount);
                  $('#cantDeleteDepartmentModal').modal("show");     
                  $('#cantDeleteDepartmentModal').on('shown.bs.modal', function () {
                  $("#cantDeleteDeptName").text(departmentRemoveName);
                });       
                }
                
              } else {
        
                $('#departmentRemoveModal .modal-title').replaceWith("Error retrieving data");
        
              } 
        
            },
            error: function (jqXHR, textStatus, errorThrown) {
              $('#departmentRemoveModal .modal-title').replaceWith("Error retrieving data");
            }
        });
        
    }
    function deleteDepartmentDetails (departmentId) {
        $('.myConfirmationBtn').on('click', function() {
        //console.log('Delete Department');
        $.ajax({
            url: "Php/deleteDepartmentByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
              id: departmentId,
            },
            success: function (result) {
                //console.log(result);       
              if (result.status.code == 200) {
                 $("#removeDepartmentAlertModal #modalRmoveDeptTitle").text("Alert");
                $("#removeDepartmentAlertModal #modalRemoveDeptBody").html("Department <strong>" + departmentRemoveName + "</strong> removed successfully!");
                $("#removeDepartmentAlertModal").modal("show");
              } else {
        
                $('#departmentRemoveModal .modal-title').replaceWith("Error retrieving data");
        
              } 
            },
            error: function (jqXHR, textStatus, errorThrown) {
            $('#departmentRemoveModal .modal-title').replaceWith("Error retrieving data");
            }
        });
          
      });
    }

    /*****************************************************************Add Location***********************************************************************/ 
    $("#addLocationForm").submit(function (event) {
        event.preventDefault(); 
    
        var locationName = $("#locationName").val();
    
        $.ajax({
            url: "Php/insertLocation.php",
            type: "POST",
            data: {
                name: locationName,
            },
            success: function (response) {
                if (response.status.code === "200") {
                    $('#addLocationForm')[0].reset();
                    fetchLocationData();
                }  
                $("#addLocationAlertModal #modalLocationAlertTitle").text("Alert");
                $("#addLocationAlertModal #modalLocationAlerBody").html("Location <strong>" + locationName + "</strong> added successfully!");
                $("#addLocationAlertModal").modal("show");
                $("#locationAddModal").modal("hide");
            },
            error: function (xhr, status, error) {
                alert("An error occurred while processing the request.");
            }
        });
    });
    
    $('#locationAddModal').on('show.bs.modal', function () {
        $('#locationName').focus();
    });
    
    $('#locationAddModal').on('hidden.bs.modal', function () {
        $('#addLocationForm')[0].reset();
    });       
    /**********************************************************Update Location Modal****************************************************************************************/
    $('#locationUpdateModal').on('show.bs.modal', function (e) {
        //var locationId = $(this).data("location-id");
        //console.log("Location ID:", locationId);
        $.ajax({
            url: "Php/getLocationByID.php",
            type: 'GET',
            dataType: 'json',
            data: {
                id:locationId
            },
            success: function (result) {
                //console.log(result);//
                var resultCode = result.status.code;

                if (resultCode == 200) {
                    console.log(result);
                    console.log("Location Name:", result.data[0].name);
                    console.log("Location Id:", result.data[0].id);
                    $('#locationID').val(result.data[0].id);
                   $('#updateLocationName').val(result.data[0].name);
    
                    // Show the update modal after data is fetched and populated
                    $("#locationUpdateModal").modal('show');
                } else {
                    $('#locationUpdateModal .modal-title').text("Error retrieving data");
                }
            },
            
            error: function (jqXHR, textStatus, errorThrown) {
                $('#locationUpdateModal .modal-title').text("Error retrieving data");
            }
        });

    });
    /************************************************************Update function*********************************************************************************** */
    $('#updateLocationForm').on("submit", function (e) {
        e.preventDefault();
        // Get the updated values from the form fields
        var locationId = $('#locationID').val();
        var updatedLocationName = $('#updateLocationName').val();
        //var updatedLocationID = $('#updateLocationDropdown').val();
        //console.log(locationId);
        console.log(updatedLocationName);
        //console.log(updatedLocationID);

        // AJAX call to update the personnel data
        $.ajax({
            url: "Php/updateLocation.php",
            type: 'POST', 
            dataType: 'json',
            data: {
                id: locationId,
                name: updatedLocationName
            },
            success: function (result) {
                var resultCode = result.status.code;
                //console.log(result);//
                
                if (resultCode == 200) {
                    $("#updateLocationAlertModal #modalLocationUpdateTitle").text("Alert");
                    $("#updateLocationAlertModal #modalLocationUpdateBody").html("Location <strong>" + updatedLocationName + "</strong> updated successfully!");
                    $("#updateLocationAlertModal").modal("show");
                    $("#locationUpdateModal").modal('hide');
                } else {
                    $('#updateLocationAlertModal #modalLocationUpdateTitle').text("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error updating location data:", errorThrown);
            }
        });
    });

    $('#locationUpdateModal').on('shown.bs.modal', function () {
    $('#updateLocationForm').focus(); 
    });

    $('#locationUpdateModal').on('hidden.bs.modal', function () {  
    $('#updateLocationForm')[0].reset();  
    });
    /*****************************************************************Remove Location***********************************************************************/  
    function checkLocationDetails () {
        //console.log('hi'); 
        //console.log(locationRemoveName);
        //$(".deleteLocationBtn").click(function() {

        $.ajax({
            url: "Php/checkLocation.php",
            type: 'POST',
            dataType: 'json',
            data: {
              id: locationId,
            },
            success: function (result) {
                //console.log(result);       
              if (result.status.code == 200) {
               //console.log('Value of locationRemoveName:', locationRemoveName);
                if (result.data.departmentCount == 0) {
                  $("#areYouSureLocationName").text(locationRemoveName);
                  $('#areYouSureDeleteLocationModal').modal("show");
                  deleteLocationDetails(locationId); 
                
                } else {
                  //console.log(result.data.departmentCount);
                  $("#ap").text(result.data.departmentCount);
                  $('#cantDeleteLocationModal').modal("show");     
                  $('#cantDeleteLocationModal').on('shown.bs.modal', function () {
                  $("#cantDeleteLocationName").text(locationRemoveName);
                });       
                }
                
              } else {
        
                $('#areYouSureDeleteLocationModal .modal-title').replaceWith("Error retrieving data");
                $('#cantDeleteLocationModal .modal-title').replaceWith("Error retrieving data");
        
              } 
        
            },
            error: function (jqXHR, textStatus, errorThrown) {
              $('#areYouSureDeleteLocationModal .modal-title').replaceWith("Error retrieving data");
              $('#cantDeleteLocationModal .modal-title').replaceWith("Error retrieving data");
            }
        });
        
    }
    function deleteLocationDetails (locationId) {
        $('.myConfirmationLocationBtn').on('click', function() {
        //console.log('Delete Location');
        $.ajax({
            url: "Php/removeLocationById.php",
            type: 'POST',
            dataType: 'json',
            data: {
              id: locationId,
            },
            success: function (result) {
                //console.log(result);       
              if (result.status.code == 200) {
                 $("#removeLocationAlertModal #modalRmoveLocationTitle").text("Alert");
                $("#removeLocationAlertModal #modalRemoveLocationBody").html("Location <strong>" + locationRemoveName + "</strong> removed successfully!");
                $("#removeLocationAlertModal").modal("show");
              } else {
        
                $('#removeLocationAlertModal .modal-title').replaceWith("Error retrieving data");
        
              } 
            },
            error: function (jqXHR, textStatus, errorThrown) {
            $('#removeLocationAlertModal .modal-title').replaceWith("Error retrieving data");
            }
        });
          
      });
    }
});

