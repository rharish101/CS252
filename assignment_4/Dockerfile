FROM php:7.2-apache
RUN apt-get update && apt-get install -y mysql-server msmtp msmtp-mta
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load
COPY src/ /var/www/html/
COPY sql_setup/ /root/
COPY msmtprc /etc/msmtprc
RUN chmod 644 /etc/msmtprc
RUN touch /root/.msmtp.log
RUN chmod 777 /root/.msmtp.log
RUN echo 'sendmail_path = "/usr/sbin/sendmail -t -i"' > /usr/local/etc/php/conf.d/mail.ini
CMD ["bash", "-c", "if [[ $PORT != \"\" ]]; then cd /etc/apache2; cat ports.conf | sed \"s/Listen 80/Listen $PORT/g\" > ports1.conf; mv ports1.conf ports.conf; fi; /etc/init.d/mysql start; /root/setup.sh; apache2-foreground"]
