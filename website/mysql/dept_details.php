<?php
  function get_largest_department($conn)
  {
    $query = "SELECT departments.dept_name, COUNT(dept_emp.emp_no) AS count FROM departments, dept_emp WHERE (departments.dept_no = dept_emp.dept_no) GROUP BY departments.dept_name ORDER BY count DESC LIMIT 1";
    $res = mysqli_query($conn, $query)
      or die("Failed to query in database: " . mysqli_error($conn));
    return mysqli_fetch_array($res);
  }

  function get_gender_ratio($conn, $dept_name)
  {
    $query = "SELECT employees.gender, COUNT(employees.emp_no) AS count FROM employees, dept_emp, departments WHERE (employees.emp_no = dept_emp.emp_no) AND (dept_emp.dept_no = departments.dept_no) AND (departments.dept_name = '". $dept_name . "') GROUP BY employees.gender";
    $res = mysqli_query($conn, $query)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row = mysqli_fetch_array($res);
    if ($row['gender'] === NULL)
    {
      die("No such department exists");
    }

    while ($row !== NULL)
    {
      if ($row['gender'] === "M")
      {
        $males = $row['count'];
      }
      else
      {
        $females = $row['count'];
      }
      $row = mysqli_fetch_array($res);
    }

    return $females / $males;
  }

  function get_pay_ratio($conn, $dept_name)
  {
    $query = "SELECT employees.gender, AVG(salaries.salary) AS avg_salary FROM employees, dept_emp, departments, salaries WHERE (employees.emp_no = dept_emp.emp_no) AND (employees.emp_no = salaries.emp_no) AND (dept_emp.dept_no = departments.dept_no) AND (departments.dept_name = '". $dept_name . "') GROUP BY employees.gender";
    $res = mysqli_query($conn, $query)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row = mysqli_fetch_array($res);
    if ($row['gender'] === NULL)
    {
      die("No such department exists");
    }

    while ($row !== NULL)
    {
      if ($row['gender'] === "M")
      {
        $males = $row['avg_salary'];
      }
      else
      {
        $females = $row['avg_salary'];
      }
      $row = mysqli_fetch_array($res);
    }

    return $females / $males;
  }

  function get_tenure_ordered($conn, $dept_name)
  {
    $query = "SELECT employees.*, dept_emp.*, departments.dept_name FROM employees, dept_emp, departments WHERE (employees.emp_no = dept_emp.emp_no) AND (dept_emp.dept_no = departments.dept_no) AND (departments.dept_name = '". $dept_name . "') ORDER BY DATEDIFF(dept_emp.from_date, dept_emp.to_date)";
    $res = mysqli_query($conn, $query)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row = mysqli_fetch_array($res);
    if ($row['dept_no'] === NULL)
    {
      die("No such department exists");
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
      echo $dept_name;
      echo "</br>";

      $from = date_create_from_format('Y-m-d', $row['from_date']);
      $to = date_create_from_format('Y-m-d', $row['to_date']);
      if ($to->format("Y") === "9999")
      {
        $to = date_create_from_format('Y-m-d', date('Y-m-d'));
      }
      $duration = date_diff($from, $to);

      if ($duration->format("%y") === "1")
      {
        $tenure = "1 year ";
      }
      elseif ($duration->format("%y") === "0")
      {
        $tenure = "";
      }
      else
      {
        $tenure = $duration->format("%y") . " years ";
      }

      if ($duration->format("%m") === "1")
      {
        $tenure = $tenure . "1 month";
      }
      elseif ($duration->format("%m") !== "0")
      {
        $tenure = $tenure . $duration->format("%m") . " months";
      }
      elseif ($duration->format("%y") === "0")
      {
        $tenure = "Fresh";
      }

      echo "Tenure: ";
      echo $tenure;
      echo "</br>";

      $row = mysqli_fetch_array($res);
      echo "</br>";
    }
  }

  function fetch_dept_data($conn, $dept_name)
  {
    if ($dept_name === "")
    {
      die("No data provided");
    }
    echo "Gender ratio (females/males) = " .  get_gender_ratio($conn, $dept_name);
    echo "<br>Gender pay ratio (females/males) = " .  get_pay_ratio($conn, $dept_name);
    echo "<br><br>List of employees in descending order of tenure:<br><br>";
    get_tenure_ordered($conn, $dept_name);
  }
?>
