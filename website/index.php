<html>
  <head>
    <title>MongoDB CS252</title>
  </head>
  <body>
    <?php
      require 'vendor/autoload.php';
      $client = new MongoDB\Client("mongodb://localhost:27017");
      $collection = $client->cases->cases;
      $result = $collection->find();
      foreach ($result as $item) {
        echo $item['DISTRICT']."<br>";
      }
    ?>
  </body>
</html>
