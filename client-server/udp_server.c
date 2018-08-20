// server code for UDP socket programming
#include <arpa/inet.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

#define IP_PROTOCOL 0
#define PORT_NO 15050
#define NET_BUF_SIZE 32
#define cipherKey 'S'
#define sendrecvflag 0
#define nofile "File Not Found!"

// funtion to clear buffer
void clearBuf(char* b)
{
    int i;
    for (i = 0; i < NET_BUF_SIZE; i++)
        b[i] = '\0';
}

// funtion to encrypt
char Cipher(char ch)
{
    return ch ^ cipherKey;
}

// funtion sending file
int sendFile(FILE* fp, char* buf, int s)
{
    int i, len;
    if (fp == NULL) {
        strcpy(buf, nofile);
        len = strlen(nofile);
        buf[len] = EOF;
        for (i = 0; i <= len; i++)
            buf[i] = Cipher(buf[i]);
        return 1;
    }

    char ch, ch2;
    for (i = 0; i < s; i++) {
        ch = fgetc(fp);
        ch2 = Cipher(ch);
        buf[i] = ch2;
        if (ch == EOF)
            return 1;
    }
    return 0;
}

// driver code
int main()
{
    int welcomeSocket, newSocket, nBytes;
    struct sockaddr_in serverAddr;
    struct sockaddr_storage serverStorage;
    char net_buf[NET_BUF_SIZE];
    FILE* fp;

     /*---- Configure settings of the server address struct ----*/
     /* Address family = Internet */
     serverAddr.sin_family = AF_INET;
     /* Set port number, using htons function to use proper byte order */
     serverAddr.sin_port = htons(5432);
     /* Set IP address to localhost */
     serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");


    welcomeSocket = socket(AF_INET, SOCK_DGRAM, 0);

    int addrlen = sizeof(serverAddr);

    bind(welcomeSocket, (struct sockaddr *) &serverAddr, sizeof(serverAddr));



    while (1) {
        printf("\nWaiting for file name...\n");

        // receive file name
        clearBuf(net_buf);
        nBytes = recvfrom(welcomeSocket, net_buf,NET_BUF_SIZE, 0,
            (struct sockaddr*)&serverAddr,  &addrlen);

        fp = fopen(net_buf, "r");
        printf("\nFile Name Received: %s\n", net_buf);
        if (fp == NULL){
            printf("\nFile open failed!\n");
            char res[50] = "NO SUCH FILE";
            res[49] = EOF;
            sendto(welcomeSocket,res,50,0,(struct sockaddr*)&serverAddr,  sizeof(serverAddr));
        }
        else{
            printf("\nFile Successfully opened!\n");
            // READ file
            char *file_contents;
            long input_file_size;
            FILE *input_file = fopen("demo.html", "rb");
            fseek(input_file, 0, SEEK_END);
            input_file_size = ftell(input_file);
            rewind(input_file);
            file_contents = malloc((input_file_size + 1) * (sizeof(char)));
            fread(file_contents, sizeof(char), input_file_size, input_file);
            fclose(input_file);
            file_contents[input_file_size] = EOF;

            sendto(welcomeSocket,file_contents,input_file_size+1,0,(struct sockaddr*)&serverAddr,  sizeof(serverAddr));
            printf("Data Sent: %s",file_contents);

        }
        if (fp != NULL)
            fclose(fp);
    }
    return 0;
}
