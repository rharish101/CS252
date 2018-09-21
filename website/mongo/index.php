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
      $max_fir = 0;
      $max_time = 0;
      $max_crime = 0;
      $min_crime = 99999999999;
      $now = date_create_from_format('Y-m-d H:i:s', date("Y-m-d H:i:s"));
      foreach ($result as $item) {
        // FIRs
        if ($firs[$item['DISTRICT']] === NULL) {
          $firs[$item['DISTRICT']] = 1;
        }
        else {
          $firs[$item['DISTRICT']] += 1;
        }
        if ($firs[$item['DISTRICT']] > $max_fir) {
          $max_fir = $firs[$item['DISTRICT']];
          $dist = $item['DISTRICT'];
        }

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

        // Crimes
        foreach ($item['Act_Section'] as $entry) {
          if ($crime[$entry] === NULL) {
            $crime[$entry] = 1;
          }
          else {
            $crime[$entry] += 1;
          }
          if ($crime[$entry] > $max_crime) {
            $max_crime = $crime[$entry];
            $top_crime = $entry;
          }
          if ($crime[$entry] < $min_crime) {
            $min_crime = $crime[$entry];
            $low_crime = $entry;
          }
        }
      }
      echo "District with most FIRs: $dist<br>";
      echo "Most inefficient police station: $ps<br>";
      echo "Most unique crime section: $low_crime<br>";
      echo "Least unique crime section: $top_crime<br>";
    ?>
  </body>
</html>
