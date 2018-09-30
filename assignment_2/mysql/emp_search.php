<?php
  function fetch_emp_data ($conn, $emp_no, $last_name, $dept_name)
  {
    $query = "SELECT employees.*, dept_emp.*, departments.dept_name
              FROM employees
              INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
              INNER JOIN departments ON dept_emp.dept_no = departments.dept_no
              WHERE (1 = 1) ";
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

    echo '
      <div class="container">
      <h2>Employee Search</h2>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Employee ID</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Department</th>
            <th>From </th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
    ';

    while ($row !== NULL)
    {
      echo '
      <tr>
      <td>' . $row['first_name'] . ' </td>
      <td>' . $row['last_name'] . ' </td>
      <td>' . $row['emp_no'] . ' </td>
      <td>' . $row['gender'] . ' </td>
      <td>' . $row['birth_date'] . ' </td>
      <td>' . $row['dept_name'] . ' </td>
      <td>' . $row['from_date'] . ' </td>
      <td>' . $row['to_date'] . ' </td>
      </tr>';

      $row = mysqli_fetch_array($res);
    }

    echo '
        </tbody>
      </table>
      </div>
    ';
  }
?>
