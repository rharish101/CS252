<?php

/*
 * Copyright (C) 2013 peredur.net
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

include_once 'psl-config.php';

function sec_session_start() {
    $session_name = 'sec_session_id';   // Set a custom session name
    $secure = SECURE;

    // This stops JavaScript being able to access the session id.
    $httponly = true;

    // Forces sessions to only use cookies.
    if (ini_set('session.use_only_cookies', 1) === FALSE) {
        header("Location: error.php?err=Could not initiate a safe session (ini_set)");
        exit();
    }

    // Gets current cookies params.
    $cookieParams = session_get_cookie_params();
    session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly);

    // Sets the session name to the one set above.
    session_name($session_name);

    session_start();            // Start the PHP session
    session_regenerate_id();    // regenerated the session, delete the old one.
}

function login($email, $password, $conn) {
    // Using prepared statements means that SQL injection is not possible.
    if (pg_prepare($conn, "", "SELECT id, username, password, salt
				  FROM members
                                  WHERE email = $1 LIMIT 1")) {
        $result = pg_execute($conn, "", array($email));    // Execute the prepared query.

        if (pg_fetch_object($result)) {
            // get variables from result.
            $user_id = pg_fetch_result($result, 0, 0);
            $username = pg_fetch_result($result, 0, 1);
            $db_password = pg_fetch_result($result, 0, 2);
            $salt = pg_fetch_result($result, 0, 3);

            // hash the password with the unique salt.
            $password = hash('sha512', $password . $salt);
            // If the user exists we check if the account is locked
            // from too many login attempts
            if (checkbrute($user_id, $conn) == true) {
                // Account is locked
                // Send an email to user saying their account is locked
                return false;
            } else {
                // Check if the password in the database matches
                // the password the user submitted.
                if ($db_password == $password) {
                    // Password is correct!
                    // Get the user-agent string of the user.
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];

                    // XSS protection as we might print this value
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id);
                    $_SESSION['user_id'] = $user_id;

                    // XSS protection as we might print this value
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $username);

                    $_SESSION['username'] = $username;
                    $_SESSION['login_string'] = hash('sha512', $password . $user_browser);

                    // Login successful.
                    return true;
                } else {
                    // Password is not correct
                    // We record this attempt in the database
                    $now = time();
                    if (!pg_query($conn, "INSERT INTO login_attempts(user_id, time)
                                    VALUES ('$user_id', '$now')")) {
                        header("Location: error.php?err=Database error: login_attempts");
                        exit();
                    }

                    return false;
                }
            }
        } else {
            // No user exists.
            return false;
        }
    } else {
        // Could not create a prepared statement
        header("Location: error.php?err=Database error: cannot prepare statement");
        exit();
    }
}

function checkbrute($user_id, $conn) {
    // Get timestamp of current time
    $now = time();

    // All login attempts are counted from the past 2 hours.
    $valid_attempts = $now - (2 * 60 * 60);

    if ($stmt = pg_prepare($conn, "", "SELECT time
                                  FROM login_attempts
                                  WHERE user_id = $1 AND time > '$valid_attempts'")) {

        // Execute the prepared query.
        $result = pg_execute($conn, "", array($user_id));

        // If there have been more than 5 failed logins
        $count = 0;
        while (pg_fetch_object($result))
            $count += 1;
        if ($count > 5) {
            return true;
        } else {
            return false;
        }
    } else {
        // Could not create a prepared statement
        header("Location: error.php?err=Database error: cannot prepare statement");
        exit();
    }
}

function login_check($conn) {
    // Check if all session variables are set
    if (isset($_SESSION['user_id'], $_SESSION['username'], $_SESSION['login_string'])) {
        $user_id = $_SESSION['user_id'];
        $login_string = $_SESSION['login_string'];
        $username = $_SESSION['username'];

        // Get the user-agent string of the user.
        $user_browser = $_SERVER['HTTP_USER_AGENT'];

        if ($stmt = pg_prepare($conn, "", "SELECT password
				      FROM members
				      WHERE id = $1 LIMIT 1")) {
            // Bind "$user_id" to parameter.
            $result = pg_execute($conn, "", array($user_id));   // Execute the prepared query.

            if (pg_fetch_object($result)) {
                // If the user exists get variables from result.
                $password = pg_fetch_result($result, 0, 0);
                $login_check = hash('sha512', $password . $user_browser);

                if ($login_check == $login_string) {
                    // Logged In!!!!
                    return true;
                } else {
                    // Not logged in
                    return false;
                }
            } else {
                // Not logged in
                return false;
            }
        } else {
            // Could not prepare statement
            header("Location: error.php?err=Database error: cannot prepare statement");
            exit();
        }
    } else {
        // Not logged in
        return false;
    }
}

function esc_url($url) {

    if ('' == $url) {
        return $url;
    }

    $url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);

    $strip = array('%0d', '%0a', '%0D', '%0A');
    $url = (string) $url;

    $count = 1;
    while ($count) {
        $url = str_replace($strip, '', $url, $count);
    }

    $url = str_replace(';//', '://', $url);

    $url = htmlentities($url);

    $url = str_replace('&amp;', '&#038;', $url);
    $url = str_replace("'", '&#039;', $url);

    if ($url[0] !== '/') {
        // We're only interested in relative links from $_SERVER['PHP_SELF']
        return '';
    } else {
        return $url;
    }
}
