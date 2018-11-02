<?php
/**
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
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

function send_mail($mysqli, $email)
{
    $prep_stmt = "SELECT username, password FROM members WHERE email = ? LIMIT 1";
    $stmt = $mysqli->prepare($prep_stmt);

    if ($stmt) {
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($username, $password);
        $stmt->fetch();

        if ($stmt->num_rows == 1) {
            $sender = 'harish.rajagopals@gmail.com';
            mail(
                // $email,
                'rharish@iitk.ac.in',
                'CS252: Reset Password',
                '<!DOCTYPE HTML>
                <html>
                    <head><title>Reset Password</title>
                    <body>
                        <p>Hello ' . $username . ',<p>
                        <p>Your token for resetting the password in Secure Login is <b>' . $password . '</b>. Do not share this with anyone.
                    </body>
                </html>',
                array(
                    'From' => $sender,
                    'Reply-To' => $sender,
                    'MIME-Version' => '1.0',
                    'Content-type' => 'text/html'
                )
            );
            return 0;
        } else {
            return 1;
        }
    } else {
        return -1;
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Secure Login: Forgot Password</title>
        <link rel="stylesheet" href="styles/main.css" />
        <script type="text/JavaScript" src="js/sha512.js"></script>
        <script type="text/JavaScript" src="js/forms.js"></script>
    </head>
    <body>
        <?php
        if (isset($_POST['done'])) {
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $result = send_mail($mysqli, $email);
            if ($result == 1) {
                echo '<p class="error">This email is not registered</p>';
            } elseif ($result == -1) {
                echo '<p class="error">Database error</p>';
            } else {
                echo '
                    <p>A mail has been sent to you</p>
                    <form action="">
                        Enter token: <input type="text" name="token" id="token" />
                        <input type="button" value="Submit token" onclick="window.location.href = \'recover.php?token=\' + String(this.form.token.value)" />
                    </form>
                    </p>Return to the <a href="index.php">login page</a>.</p>
                ';
                die();
            }
        }
        ?>
        <form action="forgot.php" method="post" name="login_form">
            <input type="hidden" name="done" value="done" />
            Email: <input type="text" name="email" />
            <input type="submit" value="Recover password" />
        </form>
        <p>We will send you a recovery link to your email</p>
        <br>
        If you have a password reset token,
        <br>
        <form action="">
            Enter token: <input type="text" name="token" id="token" />
            <input type="button" value="Submit token" onclick="window.location.href = 'recover.php?token=' + String(this.form.token.value)" />
        </form>
        </p>Return to the <a href="index.php">login page</a>.</p>
    </body>
</html>
