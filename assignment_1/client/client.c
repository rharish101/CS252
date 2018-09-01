
/* credit @Daniel Scocco */

/****************** CLIENT CODE ****************/

#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <arpa/inet.h>

int main(){
    int clientSocket;
    char buffer[1024];
    struct sockaddr_in serverAddr;
    socklen_t addr_size;
    char hello[1024];
    scanf ("%[^\n]%*c", hello);


    /*---- Create the socket. The three arguments are: ----*/
    /* 1) Internet domain 2) Stream socket 3) Default protocol (TCP in this case) */
    clientSocket = socket(PF_INET, SOCK_STREAM, 0);

    /*---- Configure settings of the server address struct ----*/
    /* Address family = Internet */
    serverAddr.sin_family = AF_INET;
    /* Set port number, using htons function to use proper byte order */
    serverAddr.sin_port = htons(5432);
    /* Set IP address to localhost */
    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");
    /* Set all bits of the padding field to 0 */
    memset(serverAddr.sin_zero, '\0', sizeof serverAddr.sin_zero);

    /*---- Connect the socket to the server using the address struct ----*/
    addr_size = sizeof serverAddr;
    connect(clientSocket, (struct sockaddr *) &serverAddr, addr_size);

    send(clientSocket , hello , strlen(hello) , 0 );

    printf("Message sent\n");

    /*---- Read the message from the server into the buffer ----*/
    int image_count;
    recv(clientSocket, &image_count, sizeof(image_count), 0);
    printf("Image count : %d\n",image_count );

    for(int i=0;i<image_count;i++){
        int img_size;
        recv(clientSocket, &img_size, sizeof(img_size), 0);
        printf("Image C : %d %d\n",i, img_size );

        //Read Picture Byte Array and convert to pic
        char p_array[img_size];
        recv(clientSocket, p_array, sizeof(p_array), 0);
        FILE *image;
        image = fopen("bat.png", "w");
        fwrite(p_array, 1, sizeof(p_array), image);
        fclose(image);


    }

    return 0;
}
