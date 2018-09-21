<?php
  function get_largest_department($conn)
  {
    $query = "SELECT * FROM departments";
    $res = mysqli_query($conn, $query)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row = mysqli_fetch_array($res);

    $max = 0;
    $max_dept = "";
    while ($row !== NULL)
    {
      $count = get_dept_count($conn, $row['dept_name']);
      if ($count > $max)
      {
        $max = $count;
        $max_dept = $row['dept_name'];
      }
      $row = mysqli_fetch_array($res);
    }

    return array($max_dept, $max);
  }

  function get_dept_count($conn, $dept_name)
  {
    // Get department number
    $query1 = "SELECT * FROM departments WHERE dept_name = '" . $dept_name . "'";
    $res1 = mysqli_query($conn, $query1)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row1 = mysqli_fetch_array($res1);

    // Get department details
    $query2 = "SELECT * FROM dept_emp WHERE dept_no = '" . $row1['dept_no'] . "'";
    $res2 = mysqli_query($conn, $query2)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row2 = mysqli_fetch_array($res2);

    $count = 0;
    while ($row2 !== NULL)
    {
      $count = $count + 1;
      $row2 = mysqli_fetch_array($res2);
    }

    return $count;
  }

  function fetch_dept_data($conn, $dept_name)
  {
    // Get department number
    $query1 = "SELECT * FROM departments WHERE dept_name = '" . $dept_name . "'";
    $res1 = mysqli_query($conn, $query1)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row1 = mysqli_fetch_array($res1);
    if ($row1['dept_no'] === NULL)
    {
      die("No such department exists");
    }

    // Get department details
    $query2 = "SELECT * FROM dept_emp WHERE dept_no = '" . $row1['dept_no'] . "'";
    $res2 = mysqli_query($conn, $query2)
      or die("Failed to query in database: " . mysqli_error($conn));

    $row2 = mysqli_fetch_array($res2);
    if ($row2['emp_no'] === NULL)
    {
      die("No such department exists");
    }

    echo "Details for department of " . ucwords($dept_name) . ":<br><br>";
    while ($row2 !== NULL)
    {
      // Get employee details
      $query3 = "SELECT * FROM employees WHERE emp_no = '" . $row2['emp_no'] . "'";
      $res3 = mysqli_query($conn, $query3)
        or die("Failed to query in database: " . mysqli_error($conn));
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
?>
