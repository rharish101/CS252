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

function fetch_data ($conn, $field, $value) {
  $query1 = "SELECT * FROM employees WHERE $field = ";
  if (gettype($value) !== "integer") {
    $query1 = $query1."'$value'";
  }
  else {
    $query1 = $query1."$value";
  }
  $res1 = mysqli_query($conn, $query1)
    or die("failed to query in database: ".mysqli_error($conn));

  $row1 = mysqli_fetch_array($res1);
  while ($row1 !== NULL) {
    $query2 = "SELECT * FROM `dept_emp` WHERE emp_no = ".$row1['emp_no'];
    $res2 = mysqli_query($conn, $query2)
      or die("failed to query in database: ".mysqli_error($conn));
    $row2 = mysqli_fetch_array($res2);

    if ($row1['first_name'] === NULL) {
      die("no such employee exists");
    }

    echo "First name: ";
    echo $row1['first_name'];
    echo "</br>";

    echo "Last name: ";
    echo $row1['last_name'];
    echo "</br>";

    echo "Gender: ";
    echo $row1['gender'];
    echo "</br>";

    echo "Birth date: ";
    echo $row1['birth_date'];
    echo "</br>";

    echo "Department Number: ";
    echo $row2['dept_no'];
    echo "</br>";

    echo "From: ";
    echo $row2['from_date'];
    echo "</br>";

    echo "To Date ";
    echo $row2['to_date'];
    echo "</br>";
    $row1 = mysqli_fetch_array($res1);
    echo "</br>";
  }
}

$em_id=$_POST['employ_id'];
$em_ln=$_POST['lastname'];
echo "<b>By Employee Number:</b><br>";
if ($em_id !== NULL) {
  fetch_data($conn, "emp_no", $em_id);
}
echo "<br><b>By Last Name:</b><br>";
if ($em_ln !== NULL) {
  fetch_data($conn, "last_name", $em_ln);
}

?>
</html>
