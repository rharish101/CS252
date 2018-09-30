<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
</head>
<body>
  <?php
    include 'emp_search.php';
    include 'dept_details.php';

    $database = include('config.php');
    // Create connection
    $conn = new mysqli($database['host'], $database['user'], $database['pass'], $database['name']);
    // Check connection
    if ($conn->connect_error)
    {
      die("Connection failed: " . $conn->connect_error);
    }

    if (isset($_POST['emp_search']))
    {
      if (preg_match("/^[A-Za-z]*$/", $_POST['lastname']) && preg_match("/^[A-Za-z]*$/", $_POST['dept_name']))
      {
        fetch_emp_data($conn, $_POST['employ_id'], $_POST['lastname'], $_POST['dept_name']);
      }
      else
        die("Incorrect inputs For employee search");
    }

    elseif (isset($_POST['larg_dept']))
    {
      $largest = get_largest_department($conn);
      echo "<br><h3 class='text-center'>Largest department: " . ucwords($largest['dept_name']) . ", No. of Employees : " . $largest['count'] . "<h3>" ;
    }

    elseif (isset($_POST['dept_det']))
    {
      if (preg_match("/^[A-Za-z]+$/", $_POST['department']))
      {
        echo '<h1 class="text-center"><u>Department of ' . ucwords($_POST['department']) . '</u></h1>';
        get_tenure_ordered($conn, $_POST['department']);
      }
      else
        die("Incorrect Department Name");
    }
    elseif (isset($_POST['gr_dept_det']))
    {
      if (preg_match("/^[A-Za-z]+$/", $_POST['gr_department']))
      {
        $gr = get_gender_ratio($conn, $_POST['gr_department']);
        echo "<br><h3 class='text-center'>Gender ratio (females/males) in " .  ucwords($_POST['gr_department']) . " department = " . $gr . '<h3>' ;
      }
      else
        die("Incorrect Department Name");
    }
    elseif (isset($_POST['gpr_dept_det']))
    {
      if (preg_match("/^[A-Za-z]+$/", $_POST['gpr_department']))
      {
        $gpr = get_pay_ratio($conn, $_POST['gpr_department']);
        echo "<br><h3 class='text-center'>Gender pay ratio (females/males) in " .  ucwords($_POST['gpr_department']) . " department = " . $gpr . '<h3>' ;
      }
      else
        die("Incorrect Department Name");
    }
  ?>
</body>
</html>
