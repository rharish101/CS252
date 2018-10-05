<?php
  $_POST = json_decode(file_get_contents('php://input'), true);
  $data = '{"name": "' . $_POST["name"] . '", "phone": ' . $_POST["phone"] .  ', "latitude": ' . $_POST["latitude"] . ', "longitude": ' . $_POST["latitude"] . '}';
  $log = file_put_contents('/home/rharish/public_html/logs.txt', $data.PHP_EOL, FILE_APPEND | LOCK_EX);
  echo $data;
?>
