#!/bin/bash
/etc/init.d/mysql start
mysql_secure_installation < /root/secure_install.txt
mysql < /root/new_user.sql
mysql secure_login < /root/secure_login.sql
