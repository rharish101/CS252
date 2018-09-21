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
      echo "<b>Employee Search</b><br><br>";
      fetch_emp_data($conn, $_POST['employ_id'], $_POST['lastname'], $_POST['dept_name']);
    }

    else
    {
      echo "<b>Department Details</b><br><br>";
      $largest = get_largest_department($conn);
      echo "Largest department: " . $largest[0] . ", count = " . $largest[1];
      echo "<br><br>";
      fetch_dept_data($conn, $_POST['department']);
    }
  ?>
</html>
