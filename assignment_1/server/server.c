/* credit @Daniel Scocco */

/****************** SERVER CODE ****************/

#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>


// char* get_image_name(int i, char * image_type){
//       char * file_name = (char*)malloc(200 * sizeof(char));
//
//       char img_flag[5];
//       sprintf(img_flag, "%d", i);
//
//       strcat(file_name,"images/");
//       strcat(file_name,image_type);
//       strcat(file_name,"/");
//       strcat(file_name,img_flag);
//       strcat(file_name,".jpg\0");
//       return file_name;
// }

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

      char query[1024];
      int valread = read( newSocket , query , 1024);


      int dog_num = 2;
      int cat_num = 2;
      int car_num = 3;
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

          char  send_buffer[pic_size];
          while(!feof(picture)) {
             fread(send_buffer, 1, sizeof(send_buffer), picture);
          }

          printf("pic size:  %d\n", pic_size);
          send(newSocket,&pic_size,sizeof(pic_size),0);
          send(newSocket,picture,pic_size,0);
      }







  }

  return 0;
}
