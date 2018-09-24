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
            echo "&nbsp;&nbsp;&nbsp;&nbsp;" . $item;
            $first = true;
          }
          else
            echo "<br>&nbsp;&nbsp;&nbsp;&nbsp;" . $item;
        }
      }

      require 'vendor/autoload.php';
      $client = new MongoDB\Client("mongodb://localhost:27017");
      $collection = $client->cases->cases;

      // FIRs
      $cursor = $collection->aggregate([
        ['$sortByCount' => '$DISTRICT'],
        ['$limit' => 1],
      ]);
      foreach ($cursor as $state)
        $dist = $state['_id'];

      // Inefficiency
      $cursor = $collection->aggregate([
        ['$group' => ['_id' => '$PS', 'total' => ['$sum' => 1], 'pending' => ['$sum' => ['$cond' => [['$eq' => ['$Status', 'Pending']], 1, 0]]]]],
        ['$addFields' => ['ratio' => ['$divide' => ['$pending', '$total']]]],
        ['$group' => ['_id' => '$ratio', 'ps' => ['$push' => '$_id']]],
        ['$sort' => ['_id' => -1]],
        ['$limit' => 1],
      ]);
      foreach ($cursor as $state)
        $ps = $state['ps'];

      /* $result = $collection->find();
      $max_time = 0;
      $now = date_create_from_format('Y-m-d H:i:s', date("Y-m-d H:i:s"));
      foreach ($result as $item) {
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
      } */

      // Crimes
      $crimes_query = array(
        ['$unwind' => '$Act_Section'],
        ['$match' => ['Act_Section' => new MongoDB\BSON\Regex('^(?!(unknown|\))$).+$')]],
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

      echo "<table cellpadding=15><tr>";
      echo "<td><b>District with most FIRs</b>";
      echo "<td><b>Most inefficient police station(s)</b>";
      echo "<td><b>Most unique crime section(s):</b>";
      echo "<td><b>Least unique crime section(s):</b></tr>";
      echo "<tr><td valign=top>" . $dist;
      echo "<td valign=top>";
      print_array($ps);
      echo "<td valign=top>";
      print_array($top_crime);
      echo "<td valign=top>";
      print_array($low_crime);
    ?>
  </body>
</html>
