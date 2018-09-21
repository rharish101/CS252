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

function query_dept($conn, $dept_name) {
  // Get department number
  $query1 = "SELECT * FROM departments WHERE dept_name = '".$dept_name."'";
  $res1 = mysqli_query($conn, $query1)
    or die("Failed to query in database: ".mysqli_error($conn));
  $row1 = mysqli_fetch_array($res1);
  if ($row1['dept_no'] === NULL) {
    die("No such employee exists");
  }

  // Get department details
  $query2 = "SELECT * FROM dept_emp WHERE dept_no = '".$row1['dept_no']."'";
  $res2 = mysqli_query($conn, $query2)
    or die("Failed to query in database: ".mysqli_error($conn));

  $row2 = mysqli_fetch_array($res2);
  if ($row2['emp_no'] === NULL) {
    die("No such employee exists");
  }

  while ($row2 !== NULL) {
    // Get employee details
    $query3 = "SELECT * FROM employees WHERE emp_no = '".$row2['emp_no']."'";
    $res3 = mysqli_query($conn, $query3)
      or die("Failed to query in database: ".mysqli_error($conn));
    $row3 = mysqli_fetch_array($res3);

    echo "First name: ";
    echo $row3['first_name'];
    echo "</br>";

    echo "Last name: ";
    echo $row3['last_name'];
    echo "</br>";

    echo "Employee ID: ";
    echo $row2['emp_no'];
    echo "</br>";

    echo "Gender: ";
    echo $row3['gender'];
    echo "</br>";

    echo "Birth date: ";
    echo $row3['birth_date'];
    echo "</br>";

    echo "Department: ";
    echo $dept_name;
    echo "</br>";

    echo "From: ";
    echo $row2['from_date'];
    echo "</br>";

    echo "To Date ";
    echo $row2['to_date'];
    echo "</br>";

    $row2 = mysqli_fetch_array($res2);
    echo "</br>";
  }
}

function fetch_data ($conn, $emp_no, $last_name, $dept_name) {
  $query1 = "SELECT * FROM employees WHERE ";
  if ($emp_no !== "") {
    $query1 = $query1."emp_no = $emp_no";
  }
  if ($last_name !== "") {
    if ($emp_no !== "") {
      $query1 = $query1." AND ";
    }
    $query1 = $query1."last_name = '$last_name'";
  }

  // Search by department instead of employees
  if (($emp_no === "") && ($last_name === "")) {
    if ($dept_name === "") {
      die("No data given");
    }
    else {
      query_dept($conn, $dept_name);
      return;
    }
  }

  // Get employee details
  $res1 = mysqli_query($conn, $query1)
    or die("Failed to query in database: ".mysqli_error($conn));
  $row1 = mysqli_fetch_array($res1);
  if ($row1['first_name'] === NULL) {
    die("No such employee exists");
  }

  $found = FALSE;
  while ($row1 !== NULL) {
    // Get department details
    $query2 = "SELECT * FROM `dept_emp` WHERE emp_no = ".$row1['emp_no'];
    $res2 = mysqli_query($conn, $query2)
      or die("failed to query in database: ".mysqli_error($conn));
    $row2 = mysqli_fetch_array($res2);

    // Get department name
    $query3 = "SELECT * FROM `departments` WHERE dept_no = '".$row2['dept_no']."'";
    $res3 = mysqli_query($conn, $query3)
      or die("failed to query in database: ".mysqli_error($conn));
    $row3 = mysqli_fetch_array($res3);

    if (($dept_name !== "") && (strcasecmp($row3['dept_name'], $dept_name) != 0)) {
      $row1 = mysqli_fetch_array($res1);
      continue;
    }
    else {
      $found = TRUE;
    }

    echo "First name: ";
    echo $row1['first_name'];
    echo "</br>";

    echo "Last name: ";
    echo $row1['last_name'];
    echo "</br>";

    echo "Employee ID: ";
    echo $row1['emp_no'];
    echo "</br>";

    echo "Gender: ";
    echo $row1['gender'];
    echo "</br>";

    echo "Birth date: ";
    echo $row1['birth_date'];
    echo "</br>";

    echo "Department: ";
    echo $row3['dept_name'];
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

  if ($found == FALSE) {
    die("No such employee exists");
  }
}

$em_id=$_POST['employ_id'];
$em_ln=$_POST['lastname'];
$em_dp=$_POST['department'];
fetch_data($conn, $em_id, $em_ln, $em_dp);

?>
</html>
