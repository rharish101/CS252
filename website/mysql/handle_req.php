<html>
  <?php
    include 'emp_search.php';
    include 'dept_details.php';

    $servername = "localhost";
    $username = $_POST['username'];
    $password = $_POST['password'];
    $dbname = "employees";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
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
        die("Incorrect inputs");
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
        die("Incorrect inputs");
    }
  ?>
</html>
