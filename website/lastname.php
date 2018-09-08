<html>


<?php
$servername = "localhost";
$username = "root";
$password = "Shubharshu@143";
$dbname = "employees";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

#$em_id=$_POST['lastname'];
$lastname=$_POST['lastname'];



$query = "SELECT `birth_date`, `first_name`, `emp_no` , `gender` , `hire_date` FROM `employees` WHERE `last_name`= '$lastname'";
	$res = mysqli_query( $conn,$query )
	or die("failed to query in database".mysqli_error($conn));
$row = mysqli_fetch_array($res);

while($row = mysqli_fetch_array($res)){
echo "First name: ";
echo $row['first_name'];
echo "</br>";

echo "Last name: ";
echo $lastname;
echo "</br>";


echo "Employee id:  ";
echo $row['emp_no'];
echo "</br>";
$em_id=$row['emp_no'];

echo "Gender: ";
echo $row['gender'];
echo "</br>";


echo "Birth date: ";
echo $row['birth_date'];
echo "</br>";




echo "</br>";
echo "</br>";
echo "</br>";
echo "</br>";
echo "</br>";
echo "</br>";
}


?>



</html>
