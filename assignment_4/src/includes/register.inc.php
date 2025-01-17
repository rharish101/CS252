<?php

/*
 * Copyright (C) 2013 peter
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

include_once 'db_connect.php';
include_once 'psl-config.php';

$error_msg = "";

function check_user_exists($conn, $username)
{
    $prep_stmt = "SELECT id FROM members WHERE username = $1 LIMIT 1";
    $stmt = pg_prepare($conn, "", $prep_stmt);

    if ($stmt) {
        $result = pg_execute($conn, "", array($username));

        if (pg_fetch_object($result)) {
            // A user with this username exists
            return 1;
        } else {
            return 0;
        }
    } else {
        return -1;
    }
}

function get_username($conn, $username)
{
    $count = 0;
    while (true) {
        $result = check_user_exists($conn, $username . ((string) $count));
        if ($result == -1) {
            return "";
        } else if ($result == 0) {
            return $username . ((string) $count);
        } else {
            $count += 1;
        }
    }
}

if (isset($_POST['username'], $_POST['email'], $_POST['p'])) {
    // Sanitize and validate the data passed in
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Not a valid email
        $error_msg .= '<p class="error">The email address you entered is not valid</p>';
    }

    $password = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);
    if (strlen($password) != 128) {
        // The hashed pwd should be 128 characters long.
        // If it's not, something really odd has happened
        $error_msg .= '<p class="error">Invalid password configuration.</p>';
    }

    // Username validity and password validity have been checked client side.
    // This should should be adequate as nobody gains any advantage from
    // breaking these rules.
    //

    $prep_stmt = "SELECT id FROM members WHERE email = $1 LIMIT 1";
    $stmt = pg_prepare($conn, "", $prep_stmt);

    if ($stmt) {
        $result = pg_execute($conn, "", array($email));

        if (pg_fetch_object($result)) {
            // A user with this email address already exists
            $error_msg .= '<p class="error">A user with this email address already exists.</p>';
        }
        else {
            $result = check_user_exists($conn, $username);
            if ($result == -1) {
                $error_msg .= '<p class="error">Database error</p>';
            } else if ($result == 1) {
                // A user with this username already exists
                $new_name = get_username($conn, $username);
                if ($username === "") {
                    $error_msg .= '<p class="error">Database error</p>';
                } else {
                    $error_msg .= '<p class="error">A user with this username already exists. How about the username ' . $new_name . ' &#63</p>';
                }
            }
        }
    } else {
        $error_msg .= '<p class="error">Database error</p>';
    }

    // TODO:
    // We'll also have to account for the situation where the user doesn't have
    // rights to do registration, by checking what type of user is attempting to
    // perform the operation.

    if (empty($error_msg)) {
        // Create a random salt
        $random_salt = hash('sha512', uniqid(openssl_random_pseudo_bytes(16), TRUE));

        // Create salted password
        $password = hash('sha512', $password . $random_salt);

        // Insert the new user into the database
        if ($insert_stmt = pg_prepare($conn, "", "INSERT INTO members (username, email, password, salt) VALUES ($1, $2, $3, $4)")) {
            $result = pg_execute($conn, "", array($username, $email, $password, $random_salt)); // Execute the prepared query.
            if (! $result) {
                header('Location: ../error.php?err=Registration failure: INSERT');
                exit();
            }
        }
        header('Location: ./register_success.php');
        exit();
    }
}
