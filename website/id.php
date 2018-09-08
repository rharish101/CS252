<html>
<?php
$servername = "localhost";
$username = $_POST['username'];
$password = $_POST['password'];
$dbname = "employees";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$em_id=$_POST['employ_id'];
$query = "SELECT `birth_date`, `first_name`, `last_name` , `gender` , `hire_date` FROM `employees` WHERE `emp_no`= '$em_id'";
	$res = mysqli_query( $conn,$query )
	or die("failed to query in database".mysqli_error($conn));
$row = mysqli_fetch_array($res);

if ($row['first_name'] === NULL) {
  die("no such employee exists");
}

echo "First name: ";
echo $row['first_name'];
echo "</br>";

echo "Last name: ";
echo $row['last_name'];
echo "</br>";

echo "Gender: ";
echo $row['gender'];
echo "</br>";


echo "Birth date: ";
echo $row['birth_date'];
echo "</br>";


$query = "SELECT `dept_no`, `from_date`, `to_date`  FROM `dept_emp` WHERE `emp_no`= '$em_id'";
  $res = mysqli_query( $conn,$query )
  or die("failed to query in database".mysqli_error($conn));
$row = mysqli_fetch_array($res);


echo "Department Number: ";
echo $row['dept_no'];
echo "</br>";

echo "From: ";
echo $row['from_date'];
echo "</br>";

echo "To Date ";
echo $row['to_date'];
echo "</br>";
?>
</html>
