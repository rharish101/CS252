#!/bin/bash


request=$1  #Assumed to be raw

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
for img in $(./img_getter.sh "$request"); do
    if [[ $img =~ "car" ]] && [ $carf = false ]; then
        html_mid="$html_mid<br />\n        <b>Cars:</b><br />"
        carf=true
    elif [[ $img =~ "truck" ]] && [ $truckf = false ]; then
        html_mid="$html_mid<br />\n        <b>Trucks:</b><br />"
        truckf=true
    elif [[ $img =~ "cat" ]] && [ $catf = false ]; then
        html_mid="$html_mid<br />\n        <b>Cats:</b><br />"
        catf=true
    elif [[ $img =~ "dog" ]] && [ $dogf = false ]; then
        html_mid="$html_mid<br />\n        <b>Dogs:</b><br />"
        dogf=true
    fi
    html_mid="$html_mid\n            <img src=\"$img\" height=\"256\" width=\"256\">"
done

echo "$html_start$html_mid$html_end" > output.html
