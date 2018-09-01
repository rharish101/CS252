
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
    char hello[300];

    scanf ("%[^\n]%*c", hello);

    printf("Message sent : %s\n", hello);

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
    int dog_count;
    recv(clientSocket, &dog_count, sizeof(dog_count), 0);
    printf("Dog count : %d\n",dog_count );

    for(int i=0;i < dog_count;i++){
        int img_size;
        recv(clientSocket, &img_size, sizeof(img_size), 0);
        printf("Image Size: %d %d\n",i, img_size );

        //Read Picture Byte Array and convert to pic
        char p_array[img_size];
        recv(clientSocket, p_array, sizeof(p_array), 0);
        FILE *image;
        switch(i){
            case 0: image = fopen("dog1.jpg","w");
                   break;
            case 1: image = fopen("dog2.jpg","w");
                   break;
            case 2: image = fopen("dog3.jpg","w");
                   break;
            case 3: image = fopen("dog4.jpg","w");
                   break;
        }

        fwrite(p_array, 1, sizeof(p_array), image);
        fclose(image);

    }

    int cat_count;
    recv(clientSocket, &cat_count, sizeof(cat_count), 0);
    printf("cat count : %d\n",cat_count );

    for(int i=0;i < cat_count;i++){
        int img_size;
        recv(clientSocket, &img_size, sizeof(img_size), 0);
        printf("Image Size: %d %d\n",i, img_size );

        //Read Picture Byte Array and convert to pic
        char p_array[img_size];
        recv(clientSocket, p_array, sizeof(p_array), 0);
        FILE *image;
        switch(i){
            case 0: image = fopen("cat1.jpg","w");
                   break;
            case 1: image = fopen("cat2.jpg","w");
                   break;
            case 2: image = fopen("cat3.jpg","w");
                   break;
            case 3: image = fopen("cat4.jpg","w");
                   break;
        }

        fwrite(p_array, 1, sizeof(p_array), image);
        fclose(image);

    }

    int car_count;
    recv(clientSocket, &car_count, sizeof(car_count), 0);
    printf("car count : %d\n",car_count );

    for(int i=0;i < car_count;i++){
        int img_size;
        recv(clientSocket, &img_size, sizeof(img_size), 0);
        printf("Image Size: %d %d\n",i, img_size );

        //Read Picture Byte Array and convert to pic
        char p_array[img_size];
        recv(clientSocket, p_array, sizeof(p_array), 0);
        FILE *image;
        switch(i){
            case 0: image = fopen("car1.jpg","w");
                   break;
            case 1: image = fopen("car2.jpg","w");
                   break;
            case 2: image = fopen("car3.jpg","w");
                   break;
            case 3: image = fopen("car4.jpg","w");
                   break;
        }

        fwrite(p_array, 1, sizeof(p_array), image);
        fclose(image);

    }

    int truck_count;
    recv(clientSocket, &truck_count, sizeof(truck_count), 0);
    printf("truck count : %d\n",truck_count );

    for(int i=0;i < truck_count;i++){
        int img_size;
        recv(clientSocket, &img_size, sizeof(img_size), 0);
        printf("Image Size: %d %d\n",i, img_size );

        //Read Picture Byte Array and convert to pic
        char p_array[img_size];
        recv(clientSocket, p_array, sizeof(p_array), 0);
        FILE *image;
        switch(i){
            case 0: image = fopen("truck1.jpg","w");
                   break;
            case 1: image = fopen("truck2.jpg","w");
                   break;
            case 2: image = fopen("truck3.jpg","w");
                   break;
            case 3: image = fopen("truck4.jpg","w");
                   break;
        }

        fwrite(p_array, 1, sizeof(p_array), image);
        fclose(image);

    }

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
