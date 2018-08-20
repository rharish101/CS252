/* credit @Daniel Scocco */

/****************** SERVER CODE ****************/

#include <stdio.h>
#include <netinet/in.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>


int main(){
  int welcomeSocket, newSocket;
  char buffer[1024];
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

      int valread = read( newSocket , buffer, 1024);

      for(int i = 0; buffer[i]; i++){
          buffer[i] = tolower(buffer[i]);
      }

      printf("%s\n",buffer );

      /*---- Send message to the socket of the incoming connection ----*/

      send(newSocket,buffer,1024,0);
  }

  return 0;
}
