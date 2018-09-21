<html>
  <?php
    include 'emp_search.php';

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

    if (isset($_POST['emp_search'])) {
      echo "<b>Employee Search</b><br><br>";
      fetch_data($conn, $_POST['employ_id'], $_POST['lastname'], $_POST['department']);
    }

    else {
      echo "<b>Department Details</b><br><br>";
    }
  ?>
</html>
