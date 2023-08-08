<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify its id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	
	
	// Check if there are any department records associated with the location before deleting
	$locationId = $_REQUEST['id'];
	$query = $conn->prepare('SELECT COUNT(*) AS departmentCount FROM department WHERE locationId = ?');
	$query->bind_param("i", $locationId);
	$query->execute();
	$result = $query->get_result()->fetch_assoc();
	//print_r($result);
	//echo $result['departmentCount'];

	if ($result['departmentCount'] > 0) {
		
		// Location has associated department, cannot delete.
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "Success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data']['departmentCount'] = $result['departmentCount'];
	 
		 mysqli_close($conn);
	 
		 echo json_encode($output);
		 exit;
	}
	// No associated Department, safe to delete the location.

	if ($result['departmentCount'] === 0) {
	
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "Success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data']['departmentCount'] = $result['departmentCount'];
	 
		 mysqli_close($conn);
	 
		 echo json_encode($output);
		 exit;
	
		}
	
	mysqli_close($conn);

	echo json_encode($output); 

?>
