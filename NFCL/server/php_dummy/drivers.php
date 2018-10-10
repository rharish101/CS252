<?php
  $_POST = json_decode(file_get_contents('php://input'), true);
  echo '{
    "drivers": [
      {
        "dist": 7,
        "name": "Motu",
        "phone": 2234567890
      },
      {
        "dist": 5,
        "name": "Ramu",
        "phone": 1234567890
      },
      {
        "dist": 8,
        "name": "Chotu",
        "phone": 3234567890
      }
    ],
    "latitude": ' . $_POST["latitude"] . ',
    "longitude": ' . $_POST["latitude"] . '
  }';
?>
