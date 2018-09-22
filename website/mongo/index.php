<html>
  <head>
    <title>MongoDB CS252</title>
  </head>
  <body>
    <?php
      function print_array($arr)
      {
        $first = false;
        foreach ($arr->bsonSerialize() as $item)
        {
          if ($first == false)
          {
            echo $item;
            $first = true;
          }
          else
            echo ", " . $item;
        }
      }

      require 'vendor/autoload.php';
      $client = new MongoDB\Client("mongodb://localhost:27017");
      $collection = $client->cases->cases;

      $result = $collection->find();
      $max_time = 0;
      $now = date_create_from_format('Y-m-d H:i:s', date("Y-m-d H:i:s"));
      foreach ($result as $item) {
        // Inefficiency
        $date_start = date_create_from_format('Y-m-d H:i:s.u', $item['Registered_Date']);
        if ($item['CS_FR_Date'] === " ") {
          $date_end = $now;
        }
        else {
          $date_end = date_create_from_format('d/m/Y', $item['CS_FR_Date']);
        }
        $duration = abs($date_start->getTimestamp() - $date_end->getTimestamp());
        if ($time[$item['PS']] === NULL) {
          $time[$item['PS']] = $duration;
        }
        else {
          $time[$item['PS']] += $duration;
        }
        if (($time[$item['PS']] / $firs[$item['DISTRICT']]) > $max_time) {
          $max_time = ($time[$item['PS']] / $firs[$item['DISTRICT']]);
          $ps = $item['PS'];
        }
      }

      // FIRs
      $cursor = $collection->aggregate([
        ['$sortByCount' => '$DISTRICT'],
        ['$limit' => 1],
      ]);
      foreach ($cursor as $state)
        $dist = $state['_id'];

      // Crimes
      $crimes_query = array(
        ['$unwind' => '$Act_Section'],
        ['$match' => ['Act_Section' => new MongoDB\BSON\Regex('^(?!(unknown)$).*$')]],
        ['$group' => ['_id' => '$_id', 'Act_Section' => ['$addToSet' => '$Act_Section']]],
        ['$unwind' => '$Act_Section'],
        ['$group' => ['_id' => '$Act_Section', 'count' => ['$sum' => 1]]],
        ['$group' => ['_id' => '$count', 'sections' => ['$push' => '$_id']]],
      );

      // Least unique crime
      $top_crimes_query = array_merge($crimes_query, [['$sort' => ['_id' => 1]], ['$limit' => 1]]);
      $cursor = $collection->aggregate($top_crimes_query);
      foreach ($cursor as $state)
        $top_crime = $state['sections'];

      // Most unique crime
      $low_crimes_query = array_merge($crimes_query, [['$sort' => ['_id' => -1]], ['$limit' => 1]]);
      $cursor = $collection->aggregate($low_crimes_query);
      foreach ($cursor as $state)
        $low_crime = $state['sections'];

      echo "District with most FIRs: $dist<br>";
      echo "Most inefficient police station: $ps<br>";
      echo "Most unique crime section(s): ";
      print_array($top_crime);
      echo "<br>Least unique crime section(s): ";
      print_array($low_crime);
      echo "<br>";
    ?>
  </body>
</html>
