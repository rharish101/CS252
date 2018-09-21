<?php
  function fetch_emp_data ($conn, $emp_no, $last_name, $dept_name)
  {
    $query = "SELECT employees.*, dept_emp.*, departments.dept_name FROM employees, dept_emp, departments WHERE (employees.emp_no = dept_emp.emp_no) AND (dept_emp.dept_no = departments.dept_no)";
    if ($emp_no !== "")
    {
      $query = $query . "AND (employees.emp_no = $emp_no)";
    }
    if ($last_name !== "")
    {
      $query = $query . "AND (employees.last_name = '$last_name')";
    }
    if ($dept_name !== "")
    {
      $query = $query . "AND (departments.dept_name = '$dept_name')";
    }
    if (($emp_no === "") && ($last_name === "") && ($dept_name === ""))
    {
      die("No data provided");
    }

    // Get employee details
    $res = mysqli_query($conn, $query)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row = mysqli_fetch_array($res);
    if ($row['first_name'] === NULL)
    {
      die("No such employee exists");
    }

    while ($row !== NULL)
    {
      echo "First name: ";
      echo $row['first_name'];
      echo "</br>";

      echo "Last name: ";
      echo $row['last_name'];
      echo "</br>";

      echo "Employee ID: ";
      echo $row['emp_no'];
      echo "</br>";

      echo "Gender: ";
      echo $row['gender'];
      echo "</br>";

      echo "Birth date: ";
      echo $row['birth_date'];
      echo "</br>";

      echo "Department: ";
      echo $row['dept_name'];
      echo "</br>";

      echo "From: ";
      echo $row['from_date'];
      echo "</br>";

      echo "To Date ";
      echo $row['to_date'];
      echo "</br>";

      $row = mysqli_fetch_array($res);
      echo "</br>";
    }
  }
?>
