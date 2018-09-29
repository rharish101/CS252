<html>
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
        echo "<b>Employee Search</b><br><br>";
        fetch_emp_data($conn, $_POST['employ_id'], $_POST['lastname'], $_POST['dept_name']);
      }
      else
        die("Incorrect inputs For employee search");
    }

    elseif (isset($_POST['larg_dept']))
    {
      $largest = get_largest_department($conn);
      echo "Largest department: " . $largest['dept_name'] . ", with " . $largest['count'] . " employees";
    }

    elseif (isset($_POST['dept_det']))
    {
      if (preg_match("/^[A-Za-z]+$/", $_POST['department']))
      {
        echo "<b>Department of " . ucwords($_POST['department']) . " Details</b><br><br>";
        fetch_dept_data($conn, $_POST['department']);
      }
      else
        die("Incorrect Department Name");
    }
    elseif (isset($_POST['gr_dept_det']))
    {
      if (preg_match("/^[A-Za-z]+$/", $_POST['gr_department']))
      {
        $gr = get_gender_ratio($conn, $_POST['gr_department']);
       echo "Gender ratio (females/males) in  " .  $_POST['gr_department'] . " Department = " . $gr ;
      }
      else
        die("Incorrect Department Name");
    }
    elseif (isset($_POST['gpr_dept_det']))
    {
      if (preg_match("/^[A-Za-z]+$/", $_POST['gpr_department']))
      {
        $gpr = get_pay_ratio($conn, $_POST['gpr_department']);
        echo "Gender Pay ratio (females/males) in  " .  $_POST['gr_department'] . " Department = " . $gpr ;
      }
      else
        die("Incorrect Department Name");
    }
  ?>
</html>
