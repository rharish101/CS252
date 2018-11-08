FROM php:7.2-apache
RUN mkdir -p /usr/share/man/man1 /usr/share/man/man7
RUN apt-get update && apt-get install -y postgresql libpq-dev msmtp msmtp-mta
RUN docker-php-ext-install pgsql && docker-php-ext-enable pgsql
RUN ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load
COPY src/ /var/www/html/
COPY msmtprc /etc/msmtprc
COPY sql_setup/ /root/
RUN chmod 644 /etc/msmtprc
RUN touch /root/.msmtp.log
RUN chmod 777 /root/.msmtp.log
RUN echo 'sendmail_path = "/usr/sbin/sendmail -t -i"' > /usr/local/etc/php/conf.d/mail.ini
CMD ["bash", "-c", "if [[ $PORT != \"\" ]]; then cd /etc/apache2; cat ports.conf | sed \"s/Listen 80/Listen $PORT/g\" > ports1.conf; mv ports1.conf ports.conf; fi; /root/setup.sh; apache2-foreground"]
