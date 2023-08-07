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
	
	// Check if there are any personnel records associated with the department before deleting
	$departmentId = $_REQUEST['id'];
	$query = $conn->prepare('SELECT COUNT(*) AS personnelCount FROM personnel WHERE departmentId = ?');
	$query->bind_param("i", $departmentId);
	$query->execute();
	$result = $query->get_result()->fetch_assoc();
	//print_r($result);
	//echo $result['personnelCount'];

	if ($result['personnelCount'] > 0) {
		
		// Department has associated personnel, cannot delete.
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "Success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data']['personnelCount'] = $result['personnelCount'];
	 
		 mysqli_close($conn);
	 
		 echo json_encode($output);
		 exit;
	}
	
	if ($deleteQuery === false) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "failed";
		$output['status']['description'] = "Department has associated personnel. Cannot delete.";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 
		exit;
	}

	
	mysqli_close($conn);

	echo json_encode($output); 

?>
