FROM gcc:8.2.0

WORKDIR /server
COPY . /server
RUN cd /server && gcc server.c -o s

CMD ["./s"]
