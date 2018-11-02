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

function reset_pass($mysqli, $old_pass, $new_pass)
{
    $random_salt = hash('sha512', uniqid(openssl_random_pseudo_bytes(16), TRUE));
    $new_pass = hash('sha512', $new_pass . $random_salt);

    $prep_stmt = "UPDATE members SET password = ?, salt = ? WHERE password = ?";
    $stmt = $mysqli->prepare($prep_stmt);

    if ($stmt) {
        $stmt->bind_param('sss', $new_pass, $random_salt, $old_pass);
        $stmt->execute();
        $stmt->store_result();
        return 0;
    } else {
        return -1;
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Secure Login: Reset Password</title>
        <link rel="stylesheet" href="styles/main.css" />
        <script type="text/JavaScript" src="js/sha512.js"></script>
        <script type="text/JavaScript" src="js/forms.js"></script>
        <?php
            if (!isset($_POST['token']) && (isset($_GET['token'])))
                echo '<script type="text/JavaScript" src="js/pass_strength.js"></script>';
        ?>
    </head>
    <body>
        <?php
        if (isset($_POST['token'])) {
            $result = reset_pass($mysqli, $_POST['token'], $_POST['p']);
            if ($result == -1) {
                die('<p class="error">Database error</p>');
            } else {
                die('<p>Password reset success.</p><br></p>Return to the <a href="index.php">login page</a>.</p>');
            }
        } elseif (!isset($_GET['token'])) {
            die('<p class="error">Incorrect token</p>');
        }
        ?>
        <ul>
            <li>Passwords must be at least 6 characters long</li>
            <li>Passwords must contain
                <ul>
                    <li>At least one upper case letter (A..Z)</li>
                    <li>At least one lower case letter (a..z)</li>
                    <li>At least one number (0..9)</li>
                </ul>
            </li>
            <li>Your password and confirmation must match exactly</li>
        </ul>
        <form action="recover.php" method="post" name="login_form">
            <input type="hidden" name="token" value="<?php echo $_GET['token'] ?>" />
            New Password: <input type="password" name="password" id="password" /> Strength: <span id="passStr">None</span><br>
            Confirm Password: <input type="password" name="confirmpwd" id="confirmpwd" />
            <input type="button"
                   value="Reset password"
                   onclick="resetformhash(this.form, this.form.password, this.form.confirmpwd);" />
        </form>
    </body>
</html>
