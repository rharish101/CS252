CREATE DATABASE secure_login;
CREATE USER 'sec_user'@'localhost' IDENTIFIED BY '4Fa98xkHVd2XmnfK';
GRANT ALL PRIVILEGES ON *.* TO 'sec_user'@'localhost';
FLUSH PRIVILEGES;
