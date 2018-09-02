
/* credit @Daniel Scocco */

/****************** CLIENT CODE ****************/

#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <arpa/inet.h>

void store_images(int clientSocket, char *img_type, int count){
    for(int i = 1; i <= count; i++){
        int img_size = 0;
        recv(clientSocket, &img_size, sizeof(img_size), 0);
        if (img_size < 0)
            img_size = 9999999;
        printf("Image Size: %d %d\n", i, img_size);

        //Read Picture Byte Array and convert to pic
        char p_array[img_size];
        recv(clientSocket, p_array, sizeof(p_array), 0);
        FILE *image;
        char dir_name[20];
        sprintf(dir_name, "images/%s", img_type);
        char img_name[25];
        sprintf(img_name, "images/%s/%d.jpg", img_type, i);


        mkdir("images", 0755);
        mkdir(dir_name, 0755);
        image = fopen(img_name,"w");

        fwrite(p_array, 1, sizeof(p_array), image);
        fclose(image);
    }
}

int main(){
    int clientSocket;
    struct sockaddr_in serverAddr;
    socklen_t addr_size;
    char hello[300];

    scanf ("%[^\n]%*c", hello);

    printf("Message to send : %s\n", hello);

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

    send(clientSocket , hello , 300 , 0 );

    printf("Message sent : %s\n", hello);

    /*---- Read the message from the server into the buffer ----*/
    int count;

    recv(clientSocket, &count, sizeof(count), 0);
    printf("Dog count : %d\n", count);
    store_images(clientSocket, "dogs", count);

    recv(clientSocket, &count, sizeof(count), 0);
    printf("cat count : %d\n",count );
    store_images(clientSocket, "cats", count);

    recv(clientSocket, &count, sizeof(count), 0);
    printf("car count : %d\n",count );
    store_images(clientSocket, "cars", count);

    recv(clientSocket, &count, sizeof(count), 0);
    printf("truck count : %d\n",count );
    store_images(clientSocket, "trucks", count);

    int html_size;
    recv(clientSocket, &html_size, sizeof(html_size), 0);
    printf("Html Size: %d \n", html_size );

    //Read Picture Byte Array and convert to pic
    char p_array[html_size];
    recv(clientSocket, p_array, sizeof(p_array), 0);
    FILE *html = fopen("output.html","w") ;
    fwrite(p_array, 1, sizeof(p_array), html);
    fclose(html);
    popen("xdg-open ./output.html", "r");

    return 0;
}
