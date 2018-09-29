<?php
  function get_largest_department($conn)
  {
    $query = "SELECT departments.dept_name, COUNT(dept_emp.emp_no) AS count
              FROM departments
              INNER JOIN dept_emp ON (departments.dept_no = dept_emp.dept_no)
              GROUP BY departments.dept_name
              ORDER BY count DESC LIMIT 1";
    $res = mysqli_query($conn, $query)
      or die("Failed to query in database: " . mysqli_error($conn));
    return mysqli_fetch_array($res);
  }

  function get_gender_ratio($conn, $dept_name)
  {
    $query = "SELECT employees.gender, COUNT(employees.emp_no) AS count
              FROM employees
              INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
              INNER JOIN departments ON dept_emp.dept_no = departments.dept_no
              WHERE departments.dept_name = '". $dept_name . "'
              GROUP BY employees.gender";
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
    $query1 = "CREATE TABLE IF NOT EXISTS mysalaries
               (PRIMARY KEY(emp_no))
               SELECT emp_no, MAX(salary) AS salary
               FROM salaries
               GROUP BY emp_no";

    $query2 = "CREATE TABLE IF NOT EXISTS mytitles
               (PRIMARY KEY(emp_no))
               SELECT t1.emp_no, t1.title
               FROM titles AS t1
               INNER JOIN
               (
                   SELECT MAX(from_date) AS maxm, emp_no
                   FROM titles
                   GROUP BY titles.emp_no
               ) AS t2 ON t1.emp_no = t2.emp_no AND t1.from_date = t2.maxm;";

    $query3 = "SELECT title, COALESCE(M, 0) AS M, COALESCE(F, 0) AS F, cnt
               FROM
               (
                 SELECT title, SUM(M) AS M, SUM(F) AS F, SUM(cnt) as cnt
                 FROM
                 (
                   SELECT
                     mytitles.title,
                     CASE WHEN employees.gender = 'M' THEN AVG(mysalaries.salary) END AS M,
                     CASE WHEN employees.gender = 'F' THEN AVG(mysalaries.salary) END AS F,
                     COUNT(employees.emp_no) AS cnt
                   FROM employees
                   INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
                   INNER JOIN mysalaries ON employees.emp_no = mysalaries.emp_no
                   INNER JOIN mytitles ON employees.emp_no = mytitles.emp_no
                   INNER JOIN departments ON dept_emp.dept_no = departments.dept_no
                   WHERE departments.dept_name = '". $dept_name . "'
                   GROUP BY mytitles.title, employees.gender
                 ) AS pay_ratio_nulls
                 GROUP BY title
               ) AS pay_ratio;";

    mysqli_query($conn, $query1)
      or die("Failed to query in database: " . mysqli_error($conn));
    mysqli_query($conn, $query2)
      or die("Failed to query in database: " . mysqli_error($conn));
    $res = mysqli_query($conn, $query3)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row = mysqli_fetch_array($res);
    if ($row['title'] === NULL)
    {
      die("No such department exists");
    }

    $total = 0;
    $weighted_ratios = 0;
    while ($row !== NULL)
    {
      if (($row['M'] != 0) && ($row['F'] != 0))
      {
        $total += $row['cnt'];
        $weighted_ratios += ($row['F'] / $row['M']) * $row['cnt'];
      }
      $row = mysqli_fetch_array($res);
    }

    return $weighted_ratios / $total;
  }

  function get_tenure_ordered($conn, $dept_name)
  {
    $query = "SELECT employees.*, dept_emp.*, departments.dept_name
              FROM employees
              INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
              INNER JOIN departments ON dept_emp.dept_no = departments.dept_no
              WHERE departments.dept_name = '". $dept_name . "'
              ORDER BY DATEDIFF(dept_emp.from_date, dept_emp.to_date)";
    $res = mysqli_query($conn, $query)
      or die("Failed to query in database: " . mysqli_error($conn));
    $row = mysqli_fetch_array($res);
    if ($row['dept_no'] === NULL)
    {
      die("No such department exists");
    }

        echo '
        <div class="container">
        <h4>List of employees in descending order of tenure</h4>
                
        <table class="table table-striped">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Employee ID</th>
              <th>Gender</th>
              <th>Birth Date</th>
              <th>Tenure</th>
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
            <td>' . $row['birth_date'] . ' </td>';
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

            echo '<td>' . $tenure .' </td>
            </tr>';
            $row = mysqli_fetch_array($res);
          }
                  
          echo '</tbody>
                </table>
                </div>
            ';
  }

  function fetch_dept_data($conn, $dept_name)
  {
    if ($dept_name === "")
    {
      die("No data provided");
    }
    return get_tenure_ordered($conn, $dept_name);
  }
?>
