#!/bin/bash
request=$1  #Assumed to be raw
flag=${2:-false}

html_start="<html>
    <head><title>CS252 A1</title></head>
    <body>"

html_end="
    </body>
</html>"

html_mid=""
IFS=$'\n'
carf=false
truckf=false
catf=false
dogf=false
for img in $(./scripts/img_getter.sh "$request"); do
    if [[ $img =~ "car" ]] && [ $carf = false ]; then
        html_mid="$html_mid<br />        <b>Cars:</b><br />"
        carf=true
    elif [[ $img =~ "truck" ]] && [ $truckf = false ]; then
        html_mid="$html_mid<br />        <b>Trucks:</b><br />"
        truckf=true
    elif [[ $img =~ "cat" ]] && [ $catf = false ]; then
        html_mid="$html_mid<br />        <b>Cats:</b><br />"
        catf=true
    elif [[ $img =~ "dog" ]] && [ $dogf = false ]; then
        html_mid="$html_mid<br />        <b>Dogs:</b><br />"
        dogf=true
    fi
    if [ $flag = true ]; then
        html_mid="$html_mid            <img src=\"$img\" height=\"256\" width=\"256\">"
    else
        html_mid="$html_mid            <img src=\"data:image/jpg;base64,$(base64 $img)\" height=\"256\" width=\"256\">"
    fi
done

output="./a1_output.html"
echo "$html_start$html_mid$html_end" > $output
# xdg-open $output
# sleep 5
# rm $output
