/* credit @Daniel Scocco */

/****************** SERVER CODE ****************/

#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>


int main(){
  int welcomeSocket, newSocket;
  struct sockaddr_in serverAddr;
  struct sockaddr_storage serverStorage;
  socklen_t addr_size;

  /*---- Create the socket. The three arguments are: ----*/
  /* 1) Internet domain 2) Stream socket 3) Default protocol (TCP in this case) */
  welcomeSocket = socket(PF_INET, SOCK_STREAM, 0);

  /*---- Configure settings of the server address struct ----*/
  /* Address family = Internet */
  serverAddr.sin_family = AF_INET;
  /* Set port number, using htons function to use proper byte order */
  serverAddr.sin_port = htons(5432);
  /* Set IP address to localhost */
  serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");
  /* Set all bits of the padding field to 0 */
  memset(serverAddr.sin_zero, '\0', sizeof serverAddr.sin_zero);

  /*---- Bind the address struct to the socket ----*/
  bind(welcomeSocket, (struct sockaddr *) &serverAddr, sizeof(serverAddr));

  /*---- Listen on the socket, with 5 max connection requests queued ----*/
  while(1){
      if(listen(welcomeSocket,5)==0)
        printf("I'm listening\n");
      else
        printf("Error\n");

      /*---- Accept call creates a new socket for the incoming connection ----*/
      addr_size = sizeof serverStorage;
      newSocket = accept(welcomeSocket, (struct sockaddr *) &serverStorage, &addr_size);

      char query[300];
      int valread = recv( newSocket , query , 300, 0);

      printf(" query : %s\n", query );


      // do to: soft code this based on query
      char temp_query[200] = "4 car, 4 dogs, 4 cats and 4 trucks";
      char bash_command[250] = "./scripts/gen_html.sh \" ";
      strcat(bash_command,temp_query);
      strcat(bash_command,"\"");
      system(bash_command);

      int dog_num = 4;
      int cat_num = 4;
      int car_num = 4;
      int truck_num = 4;

      send(newSocket, &dog_num,sizeof(dog_num),0);
      for(int i=0; i< dog_num;i++){
          FILE *picture;
          switch(i){
              case 0: picture = fopen("images/dogs/1.jpg","r");
                     break;
              case 1: picture = fopen("images/dogs/2.jpg","r");
                     break;
              case 2: picture = fopen("images/dogs/3.jpg","r");
                     break;
              case 3: picture = fopen("images/dogs/4.jpg","r");
                     break;
          }

          int pic_size;
          fseek(picture, 0, SEEK_END);
          pic_size = ftell(picture);
          fseek(picture, 0, SEEK_SET);

          send(newSocket,&pic_size,sizeof(pic_size),0);

          char send_buffer[pic_size];
          fread(send_buffer, 1, sizeof(send_buffer), picture);
          printf("pic size:  %d\n", pic_size);

          send(newSocket,send_buffer,pic_size,0);
      }

      send(newSocket, &cat_num,sizeof(cat_num),0);
      for(int i=0; i< cat_num;i++){
          FILE *picture;
          switch(i){
              case 0: picture = fopen("images/cats/1.jpg","r");
                     break;
              case 1: picture = fopen("images/cats/2.jpg","r");
                     break;
              case 2: picture = fopen("images/cats/3.jpg","r");
                     break;
              case 3: picture = fopen("images/cats/4.jpg","r");
                     break;
          }

          int pic_size;
          fseek(picture, 0, SEEK_END);
          pic_size = ftell(picture);
          fseek(picture, 0, SEEK_SET);

          send(newSocket,&pic_size,sizeof(pic_size),0);

          char send_buffer[pic_size];\
          fread(send_buffer, 1, sizeof(send_buffer), picture);
          printf("pic size:  %d\n", pic_size);

          send(newSocket,send_buffer,pic_size,0);
      }

      send(newSocket, &car_num,sizeof(car_num),0);
      for(int i=0; i< car_num;i++){
          FILE *picture;
          switch(i){
              case 0: picture = fopen("images/cars/1.jpg","r");
                     break;
              case 1: picture = fopen("images/cars/2.jpg","r");
                     break;
              case 2: picture = fopen("images/cars/3.jpg","r");
                     break;
              case 3: picture = fopen("images/cars/4.jpg","r");
                     break;
          }

          int pic_size;
          fseek(picture, 0, SEEK_END);
          pic_size = ftell(picture);
          fseek(picture, 0, SEEK_SET);

          send(newSocket,&pic_size,sizeof(pic_size),0);

          char send_buffer[pic_size];\
          fread(send_buffer, 1, sizeof(send_buffer), picture);
          printf("pic size:  %d\n", pic_size);

          send(newSocket,send_buffer,pic_size,0);
      }

      send(newSocket, &truck_num,sizeof(truck_num),0);
      for(int i=0; i< truck_num;i++){
          FILE *picture;
          switch(i){
              case 0: picture = fopen("images/trucks/1.jpg","r");
                     break;
              case 1: picture = fopen("images/trucks/2.jpg","r");
                     break;
              case 2: picture = fopen("images/trucks/3.jpg","r");
                     break;
              case 3: picture = fopen("images/trucks/4.jpg","r");
                     break;
          }

          int pic_size;
          fseek(picture, 0, SEEK_END);
          pic_size = ftell(picture);
          fseek(picture, 0, SEEK_SET);

          send(newSocket,&pic_size,sizeof(pic_size),0);

          char send_buffer[pic_size];\
          fread(send_buffer, 1, sizeof(send_buffer), picture);
          printf("pic size:  %d\n", pic_size);

          send(newSocket,send_buffer,pic_size,0);
      }


      // send html file
      FILE *html = fopen("a1_output.html", "r");

      int html_size;
      fseek(html, 0, SEEK_END);
      html_size = ftell(html);
      fseek(html, 0, SEEK_SET);

      send(newSocket,&html_size,sizeof(html_size),0);

      char send_buffer[html_size];\
      fread(send_buffer, 1, sizeof(send_buffer), html);
      printf("html size:  %d\n", html_size);

      send(newSocket,send_buffer,html_size,0);

  }

  return 0;
}
